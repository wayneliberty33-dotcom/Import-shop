import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { afterEach, test } from "node:test";
import initializePayment from "../api/initialize-payment.js";
import verifyPayment from "../api/verify-payment.js";

const originalFetch = globalThis.fetch;
const originalSecretKey = process.env.PAYSTACK_SECRET_KEY;
const originalAppUrl = process.env.APP_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalSecretKey === undefined) delete process.env.PAYSTACK_SECRET_KEY;
  else process.env.PAYSTACK_SECRET_KEY = originalSecretKey;
  if (originalAppUrl === undefined) delete process.env.APP_URL;
  else process.env.APP_URL = originalAppUrl;
});

function responseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("server-side checkout prices match the storefront catalog", async () => {
  const [appSource, apiSource] = await Promise.all([
    readFile(new URL("../js/app.js", import.meta.url), "utf8"),
    readFile(new URL("../api/initialize-payment.js", import.meta.url), "utf8"),
  ]);
  const appCatalog = Object.fromEntries(
    [...appSource.matchAll(/id: '([^']+)',[\s\S]*?price: (\d+),/g)]
      .map(([, id, price]) => [id, Number(price)]),
  );
  const apiCatalogSource = apiSource.match(/const products = \{([\s\S]*?)\n\};/)?.[1] || "";
  const apiCatalog = Object.fromEntries(
    [...apiCatalogSource.matchAll(/"([^"]+)": (\d+),/g)]
      .map(([, id, price]) => [id, Number(price)]),
  );

  assert.deepEqual(apiCatalog, appCatalog);
});

test("initializes Paystack with the server-calculated cart amount", async () => {
  process.env.PAYSTACK_SECRET_KEY = "sk_test_example";
  process.env.APP_URL = "https://shop.example";
  let requestBody;
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return Response.json({
      status: true,
      data: {
        reference: requestBody.reference,
        authorization_url: "https://checkout.paystack.com/example",
      },
    });
  };

  const res = responseRecorder();
  await initializePayment({
    method: "POST",
    body: {
      email: "shopper@example.com",
      items: [{ id: "smart-watch", quantity: 2 }, { id: "oil-spray-bottle", quantity: 1 }],
    },
  }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(requestBody.amount, 4_300_000);
  assert.equal(requestBody.currency, "NGN");
  assert.equal(requestBody.callback_url, "https://shop.example/");
  assert.deepEqual(requestBody.metadata.items, [
    { id: "smart-watch", quantity: 2 },
    { id: "oil-spray-bottle", quantity: 1 },
  ]);
  assert.equal(res.body.authorizationUrl, "https://checkout.paystack.com/example");
});

test("rejects invalid cart items without contacting Paystack", async () => {
  let contactedPaystack = false;
  globalThis.fetch = async () => {
    contactedPaystack = true;
    throw new Error("Paystack should not be called");
  };
  const res = responseRecorder();

  await initializePayment({
    method: "POST",
    body: { email: "shopper@example.com", items: [{ id: "unknown-product", quantity: 1 }] },
  }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(contactedPaystack, false);
});

test("returns order details only for a verified successful NGN payment", async () => {
  process.env.PAYSTACK_SECRET_KEY = "sk_test_example";
  const reference = "libway-123e4567-e89b-12d3-a456-426614174000";
  globalThis.fetch = async (url) => {
    assert.equal(url, `https://api.paystack.co/transaction/verify/${reference}`);
    return Response.json({
      status: true,
      data: {
        reference,
        status: "success",
        currency: "NGN",
        amount: 4_300_000,
        customer: { email: "shopper@example.com" },
        metadata: {
          store: "LIBWAY SHOP",
          expected_amount: 4_300_000,
          items: [{ id: "smart-watch", quantity: 2 }, { id: "oil-spray-bottle", quantity: 1 }],
        },
      },
    });
  };
  const res = responseRecorder();

  await verifyPayment({ method: "POST", body: { reference } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.total, 43_000);
  assert.equal(res.body.email, "shopper@example.com");
  assert.deepEqual(res.body.items, [
    { id: "smart-watch", quantity: 2 },
    { id: "oil-spray-bottle", quantity: 1 },
  ]);
});

test("does not treat an unsuccessful Paystack transaction as paid", async () => {
  process.env.PAYSTACK_SECRET_KEY = "sk_test_example";
  const reference = "libway-123e4567-e89b-12d3-a456-426614174000";
  globalThis.fetch = async () => Response.json({
    status: true,
    data: {
      reference,
      status: "abandoned",
      currency: "NGN",
      amount: 4_300_000,
      customer: { email: "shopper@example.com" },
      metadata: { store: "LIBWAY SHOP", expected_amount: 4_300_000 },
    },
  });
  const res = responseRecorder();

  await verifyPayment({ method: "POST", body: { reference } }, res);

  assert.equal(res.statusCode, 402);
  assert.equal(res.body.success, undefined);
});
