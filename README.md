# Parcel & Pine import shop

A responsive storefront built with plain HTML, CSS, and JavaScript.

## Project structure

- `index.html` — storefront layout and accessible dialog/form markup
- `account.html` — customer sign-in, order history, and sign-out page
- `css/styles.css` — responsive visual design and mobile navigation/cart layouts
- `js/app.js` — product catalog, search, category filters, sorting, details, persistent cart, and demo checkout
- `js/account.js` — customer account authentication and order history
- `assets/products/` — individual product photos cropped from the product sheet

## Run locally

Open `index.html` in a modern browser. Product catalog photos are stored locally; hero photos and web fonts are served from external hosts and need an internet connection. Cart contents are stored in the browser with local storage.

Checkout is a front-end demo only; it validates the shipping form and displays an order confirmation but does not take payment or send orders to a server.

The account page uses Google sign-in through Supabase and reuses the storefront's existing OAuth callback URL. After sign-in, customers can return to the account page to view their orders.
