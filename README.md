# ESR Choco BD — Premium Retail Store

A mobile-first e-commerce storefront for **chocolate, coffee, premium nuts, dates and gift items**. The public storefront is designed around a cocoa, cream and warm-gold visual identity.

## Stack
- React 18, Vite and Tailwind CSS
- Node.js + Express API
- MongoDB / Mongoose
- Cloudinary for persistent product images
- Docker Compose support

## Included storefront features
- Premium homepage and collection-led navigation
- Search by product name, brand, SKU and flavour
- Product detail pages with weight, ingredients, expiry and storage details
- Cart, checkout, order tracking and order confirmation
- WhatsApp-first customer support
- Admin product, category, order, review and store-settings management
- Responsive layouts for mobile, tablet and desktop

## Run locally
1. Copy `.env.example` to `.env`.
2. Set the required environment values locally. Never commit `.env`.
3. Install dependencies:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
4. Start both apps:
   ```bash
   npm run dev
   ```

## Deployment notes
- Set the same server environment variables in your hosting provider.
- Configure MongoDB and all three Cloudinary credentials.
- Keep product images in Cloudinary; do not rely on the server's local upload folder in ephemeral hosting.
- The API startup performs a small, non-destructive retail-category migration: it creates the Coffee category if missing and renames only the original seeded category display names. Existing category IDs and product references are preserved.
- Known legacy farm categories (`pure-honey`, `seasonal-fruits`, `agricultural-products`) are hidden from the public catalogue; their database records are preserved for admin review.
- **Do not run the seed script against an existing production database.** The seed routine is intended for a fresh database and may deactivate legacy categories/products. For an existing store, use the admin panel for product and category changes.

## Build
```bash
npm run build
```

The project does not currently include an automated test suite.
