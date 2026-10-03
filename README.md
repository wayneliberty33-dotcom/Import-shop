# Parcel & Pine import shop

A responsive storefront built with plain HTML, CSS, and JavaScript.

## Project structure

- `index.html` — storefront layout and accessible dialog/form markup
- `account.html` — customer sign-in, order history, and sign-out page
- `css/styles.css` — responsive visual design and mobile navigation/cart layouts
- `js/app.js` — product catalog, search, category filters, sorting, details, persistent cart, and Paystack checkout
- `js/account.js` — customer account authentication and order history
- `api/initialize-payment.js` and `api/verify-payment.js` — server-side Paystack checkout and payment verification
- `assets/products/` — individual product photos cropped from the product sheet

## Deploy

The full shop, including its serverless email endpoint, must be deployed to a host that runs functions. GitHub Pages only serves static files, so orders submitted from the GitHub Pages URL cannot use `/api/send-email`.

To deploy on Vercel:

1. Import this GitHub repository into Vercel. Keep the project root at the repository root; no build command or output directory is needed.
2. In the Gmail account that will send shop email, enable 2-Step Verification and create an App Password. Do not use the account's normal password.
3. In Vercel project settings, add the environment variables listed in `.env.example`. Keep the Gmail App Password and Paystack secret key private, set `APP_URL` to the deployed HTTPS shop URL, and set `ORDER_NOTIFICATION_EMAIL` to the address that should receive order alerts. Start with a Paystack test secret key; switch to a live key only after completing Paystack's account activation and testing the checkout.
4. Redeploy after saving the environment variables.
5. Use the configured `APP_URL` as the shop URL. The `/api/initialize-payment` function calculates the NGN amount from the server-side catalog, Paystack collects payment, and `/api/verify-payment` confirms the transaction before the order is saved. `/api/send-email` continues to send newsletter messages and sends paid-order confirmations only after verifying the Paystack transaction.

Checkout saves the customer email and verified order total in Supabase after payment. The checkout currently does not collect a shipping address; the shop will need to arrange delivery details with the customer after purchase. Keep the server-side product IDs and prices in `api/initialize-payment.js` in sync with the catalog in `js/app.js`.

Google sign-in and order storage also depend on the Supabase project configured in the JavaScript. Add the deployed Vercel URL to that Supabase project's allowed redirect URLs. If you do not have access to that Supabase project, its owner must make this change and confirm the orders table is configured.

Keep `.env` files and App Passwords private. `.env.example` contains placeholders only; do not replace them with real credentials in a commit. Gmail has sending limits and may block sign-in if 2-Step Verification and an App Password are not configured.

## Local preview

The static design can be previewed by opening `index.html` in a browser. Product catalog photos are local; hero photos and web fonts need an internet connection. To test the API locally, use Vercel's development tooling, configure local environment variables without committing them, and use Paystack test keys. A deployed HTTPS URL is required for live payments.
