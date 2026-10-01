export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, message } = req.body;

  const response = await fetch(
    https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(api:${process.env.MAILGUN_API_KEY}).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        from: Import Shop <${process.env.MAILGUN_FROM_EMAIL}>,
        to: process.env.SHOP_EMAIL,
        subject: "New Import Shop Message",
        text: Customer email: ${email}\n\nMessage:\n${message},
      }),
    }
  );

  const data = await response.text();

  if (!response.ok) {
    return res.status(500).json({ error: data });
  }

  res.status(200).json({ success: true });
}
