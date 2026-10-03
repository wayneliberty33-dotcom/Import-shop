# Parcel & Pine import shop

A responsive storefront built with plain HTML, CSS, and JavaScript.

## Project structure

- `index.html` — storefront layout and accessible dialog/form markup
- `account.html` — customer sign-in, order history, and sign-out page
- `css/styles.css` — responsive visual design and mobile navigation/cart layouts
- `js/app.js` — product catalog, search, category filters, sorting, details, persistent cart, and demo checkout
- `js/account.js` — customer account authentication and order history
- `assets/products/` — individual product photos cropped from the product sheet

## Deploy

The full shop, including its serverless email endpoint, must be deployed to a host that runs functions. GitHub Pages only serves static files, so orders submitted from the GitHub Pages URL cannot use `/api/send-email`.

To deploy on Vercel:

1. Import this GitHub repository into Vercel. Keep the project root at the repository root; no build command or output directory is needed.
2. In Mailgun, verify a sending domain and complete its DNS setup with your domain provider. A Mailgun sandbox domain can only deliver to recipients you have authorized.
3. In Vercel project settings, add the environment variables listed in `.env.example`: use the verified domain, keep the API key private, choose the correct US/EU region, and set the shop notification email.
4. Redeploy after saving the environment variables.
5. Use the Vercel URL as the shop URL. The `/api/send-email` function will then send newsletter email and order confirmations through Mailgun.

Checkout saves the customer email and order total in Supabase but does not take payment or collect shipping details. Mailgun sends an order-request confirmation to the customer and a notification to the shop owner; the confirmation does not mean payment was taken.

Google sign-in and order storage also depend on the Supabase project configured in the JavaScript. Add the deployed Vercel URL to that Supabase project's allowed redirect URLs. If you do not have access to that Supabase project, its owner must make this change and confirm the orders table is configured.

Keep `.env` files and API keys private. `.env.example` contains placeholders only; do not replace them with real credentials in a commit.

## Local preview

The static design can be previewed by opening `index.html` in a browser. Product catalog photos are local; hero photos and web fonts need an internet connection. To test the API locally, use Vercel's development tooling and configure local environment variables without committing them.
