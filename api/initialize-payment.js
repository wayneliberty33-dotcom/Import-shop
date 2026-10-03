import { randomUUID } from "node:crypto";
import { isValidEmail, paystackRequest } from "./paystack.js";

const products = {
  "smart-watch": 18500,
  "wireless-earbuds": 15000,
  "electric-shaver": 22000,
  "car-vacuum": 25000,
  "phone-tripod-ring-light": 15000,
  "mini-hair-styling-kit": 25000,
  "makeup-organizer": 12000,
  "jewelry-organizer": 10000,
  "power-bank": 25000,
  "rechargeable-mini-fan": 20000,
  "mini-label-printer": 18000,
  "digital-luggage-scale": 8500,
  "bluetooth-speaker": 25000,
  "hand-warmer": 18000,
  "electric-air-pump": 30000,
  "motion-sensor-night-light": 8000,
  "milk-frother": 9500,
  "digital-kitchen-scale": 12000,
  "electric-food-chopper": 18000,
  "oil-spray-bottle": 6000,
};

function getCallbackUrl() {
  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    throw new Error("APP_URL is not configured");
  }

  let url;
  try {
    url = new URL(appUrl);
  } catch {
    throw new Error("APP_URL must be a valid URL");
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("APP_URL must use HTTPS");
  }
  return new URL("/", url).href;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email) || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return res.status(400).json({ error: "A valid email and non-empty cart are required" });
  }

  let total = 0;
  const items = [];
  for (const item of body.items) {
    const price = Object.hasOwn(products, item?.id) ? products[item.id] : undefined;
    if (!price || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      return res.status(400).json({ error: "The cart contains an invalid product or quantity" });
    }
    total += price * item.quantity;
    items.push({ id: item.id, quantity: item.quantity });
  }

  const amount = total * 100;
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return res.status(400).json({ error: "The cart total is invalid" });
  }

  const reference = `libway-${randomUUID()}`;
  try {
    const payment = await paystackRequest("/transaction/initialize", {
      email,
      amount,
      currency: "NGN",
      reference,
      callback_url: getCallbackUrl(),
      metadata: {
        store: "LIBWAY SHOP",
        items,
        expected_amount: amount,
      },
    });
    if (payment.reference !== reference || typeof payment.authorization_url !== "string") {
      throw new Error("Paystack returned an invalid checkout session");
    }
    return res.status(200).json({
      authorizationUrl: payment.authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Paystack checkout could not be initialized:", error.message);
    return res.status(502).json({ error: "Secure checkout could not be started. Please try again." });
  }
}
