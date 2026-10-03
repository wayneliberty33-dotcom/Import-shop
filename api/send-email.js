import nodemailer from "nodemailer";
import { isVerifiedPayment, paystackRequest } from "./paystack.js";

let transporter;

function getTransporter() {
  const user = process.env.GMAIL_SMTP_USER;
  const password = process.env.GMAIL_SMTP_APP_PASSWORD;
  if (!user || !password) {
    throw new Error("Gmail SMTP environment variables are missing");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass: password.replace(/\s/g, ""),
      },
    });
  }
  return transporter;
}

async function sendEmail(message) {
  const user = process.env.GMAIL_SMTP_USER;
  const mailer = getTransporter();
  await mailer.sendMail({
    from: `LIBWAY SHOP <${user}>`,
    ...message,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const type = body.type || "newsletter";

  if (type === "newsletter") {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email address is required" });
    }

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to LIBWAY SHOP",
        text: "Thanks for joining the LIBWAY SHOP list. We will keep you posted about new finds and updates.",
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Newsletter email failed:", error.message);
      return res.status(502).json({ error: "Could not send newsletter email" });
    }
  }

  if (type !== "order_confirmation") {
    return res.status(400).json({ error: "Unsupported email type" });
  }

  const reference = typeof body.reference === "string" ? body.reference : "";
  if (!/^libway-[\w-]{36}$/.test(reference)) {
    return res.status(400).json({ error: "A valid payment reference is required" });
  }

  let payment;
  try {
    payment = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
  } catch (error) {
    console.error("Order payment verification failed:", error.message);
    return res.status(502).json({ error: "The payment could not be verified" });
  }
  if (!isVerifiedPayment(payment, reference)) {
    return res.status(402).json({ error: "The payment has not been verified as successful" });
  }

  const customerEmail = payment.customer.email;
  const total = payment.amount / 100;
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  if (!notificationEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail)) {
    return res.status(500).json({ error: "Order notification email is not configured" });
  }

  const formattedTotal = `₦${total.toLocaleString("en-NG")}`;
  const customerMessage = {
    to: customerEmail,
    subject: "Payment confirmed | LIBWAY SHOP",
    text: `Thank you for shopping with LIBWAY SHOP. Your payment of ${formattedTotal} has been confirmed.\n\nPayment reference: ${reference}\nWe will follow up with you by email about your order.`,
  };
  const shopMessage = {
    to: notificationEmail,
    subject: "Paid order | LIBWAY SHOP",
    text: `A payment has been confirmed.\n\nCustomer email: ${customerEmail}\nOrder total: ${formattedTotal}\nPayment reference: ${reference}`,
  };

  try {
    const results = await Promise.allSettled([
      sendEmail(customerMessage),
      sendEmail(shopMessage),
    ]);
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length) {
      console.error("Paid order email delivery failed:", failures.map((failure) => failure.reason.message));
      return res.status(502).json({ error: "The payment succeeded, but one or more confirmation emails could not be sent" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Paid order email failed:", error.message);
    return res.status(502).json({ error: "The payment succeeded, but confirmation emails could not be sent" });
  }
}
