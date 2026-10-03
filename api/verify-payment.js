import { isVerifiedPayment, paystackRequest } from "./paystack.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const reference = typeof req.body?.reference === "string" ? req.body.reference : "";
  if (!/^libway-[\w-]{36}$/.test(reference)) {
    return res.status(400).json({ error: "A valid payment reference is required" });
  }

  try {
    const payment = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
    if (!isVerifiedPayment(payment, reference)) {
      return res.status(402).json({ error: "Payment has not been verified as successful" });
    }
    return res.status(200).json({
      success: true,
      email: payment.customer.email,
      total: payment.amount / 100,
      items: payment.metadata.items,
      reference: payment.reference,
    });
  } catch (error) {
    console.error("Paystack payment verification failed:", error.message);
    return res.status(502).json({ error: "Payment could not be verified. Please try again." });
  }
}
