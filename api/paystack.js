const PAYSTACK_API_URL = "https://api.paystack.co";

function getSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }
  return secretKey;
}

export async function paystackRequest(path, body) {
  const response = await fetch(`${PAYSTACK_API_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.status || !result.data) {
    throw new Error(`Paystack request failed (HTTP ${response.status})`);
  }
  return result.data;
}

export function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isVerifiedPayment(payment, reference) {
  return payment?.reference === reference
    && payment.status === "success"
    && payment.currency === "NGN"
    && Number.isSafeInteger(payment.amount)
    && payment.amount > 0
    && payment.metadata?.store === "LIBWAY SHOP"
    && payment.metadata?.expected_amount === payment.amount
    && isValidEmail(payment.customer?.email);
}
