function getMailgunEndpoint(domain, region) {
  const host = region === "eu" ? "api.eu.mailgun.net" : "api.mailgun.net";
  return `https://${host}/v3/${domain}/messages`;
}

async function sendMailgunMessage({ domain, apiKey, region, message }) {
  const response = await fetch(getMailgunEndpoint(domain, region), {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      from: `LIBWAY SHOP <postmaster@${domain}>`,
      ...message,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`Mailgun request failed (${response.status}):`, details);
    throw new Error(`Mailgun request failed with HTTP ${response.status}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const type = body.type || "newsletter";
  const domain = process.env.MAILGUN_DOMAIN;
  const apiKey = process.env.MAILGUN_API_KEY;
  const region = process.env.MAILGUN_REGION || "us";

  if (!domain || !apiKey) {
    return res.status(500).json({ error: "Mailgun environment variables are missing" });
  }
  if (!["us", "eu"].includes(region)) {
    return res.status(500).json({ error: "MAILGUN_REGION must be either us or eu" });
  }

  if (type === "newsletter") {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email address is required" });
    }

    try {
      await sendMailgunMessage({
        domain,
        apiKey,
        region,
        message: {
          to: email,
          subject: "Welcome to LIBWAY SHOP",
          text: "Thanks for joining the LIBWAY SHOP list. We will keep you posted about new finds and updates.",
        },
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Newsletter email failed:", error);
      return res.status(502).json({ error: "Could not send newsletter email" });
    }
  }

  if (type !== "order_confirmation") {
    return res.status(400).json({ error: "Unsupported email type" });
  }

  const customerEmail = typeof body.email === "string" ? body.email.trim() : "";
  const total = Number(body.total);
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || !Number.isFinite(total) || total <= 0) {
    return res.status(400).json({ error: "A valid customer email and order total are required" });
  }
  if (!notificationEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail)) {
    return res.status(500).json({ error: "Order notification email is not configured" });
  }

  const formattedTotal = `₦${total.toLocaleString("en-NG")}`;
  const customerMessage = {
    to: customerEmail,
    subject: "We received your order | LIBWAY SHOP",
    text: `Thank you for shopping with LIBWAY SHOP. We received your order request with a total of ${formattedTotal}.\n\nThis shop demo does not process payments or collect shipping details, so this email confirms that your order request was saved, not that payment was taken. We will follow up with you by email.`,
  };
  const shopMessage = {
    to: notificationEmail,
    subject: "New order request | LIBWAY SHOP",
    text: `A new order request was saved.\n\nCustomer email: ${customerEmail}\nOrder total: ${formattedTotal}\n\nThis shop demo does not process payments or collect shipping details.`,
  };

  const results = await Promise.allSettled([
    sendMailgunMessage({ domain, apiKey, region, message: customerMessage }),
    sendMailgunMessage({ domain, apiKey, region, message: shopMessage }),
  ]);
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length) {
    console.error("Order confirmation email delivery failed:", failures.map((failure) => failure.reason));
    return res.status(502).json({ error: "The order was saved, but one or more confirmation emails could not be sent" });
  }

  return res.status(200).json({ success: true });
}
