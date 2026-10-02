export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const domain = process.env.MAILGUN_DOMAIN;
    const apiKey = process.env.MAILGUN_API_KEY;

    if (!domain || !apiKey) {
      return res.status(500).json({ error: "Mailgun environment variables are missing" });
    }

    const response = await fetch(
      `https://api.mailgun.net/v3/${domain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          from: `Import Shop <postmaster@${domain}>`,
          to: email,
          subject: "Welcome to Import Shop",
          text: "Thanks for joining the Import Shop list. We will keep you posted about new finds and updates.",
        }),
      }
    );

    const data = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mailgun error:", error);
    return res.status(500).json({ error: "Could not send email" });
  }
}