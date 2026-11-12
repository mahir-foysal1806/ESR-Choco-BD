# ESR Choco BD — E-commerce

Mobile-first storefront for chocolates, premium nuts, dates and gift boxes. Existing storefront/admin workflows are retained: product and category management, stock, orders, order tracking, reviews, shipping, settings, and payment gateway hooks.

## Stack
- React + Vite + Tailwind CSS
- Node.js + Express API
- MongoDB (persistent Docker volume)
- Cloudinary for persistent image delivery
- Docker Compose for deployment

## Run with Docker
1. Copy `.env.example` to `.env`.
2. Set a long random `JWT_SECRET`, a strong `ADMIN_PASSWORD`, your real domain in `CLIENT_URL` and `SITE_URL`, and all three Cloudinary credentials.
3. Start: `docker compose up -d --build`
4. Seed the catalog and first admin once: `docker compose exec app node server/src/seed/seed.js`
5. Open `https://your-domain.com/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

MongoDB data is persisted in the `mongo_data` Docker volume. Product/banner images uploaded through Admin are sent directly to Cloudinary and the database stores their secure URLs. Container rebuilds/restarts will not erase either MongoDB data or Cloudinary media.

## Local development
- `npm install --prefix server`
- `npm install --prefix client`
- Set `server/.env` from `server/.env.example` and run MongoDB.
- `npm run dev --prefix server` and `npm run dev --prefix client`.

## Catalog migration note
The seed adds the ESR Choco BD categories and updates store branding. Existing legacy categories are deactivated, not deleted. Existing product records are intentionally not deleted automatically. To replace a populated demo catalog, back up MongoDB first, then run the seed with `--reset` only if you explicitly want all existing product records removed; order snapshots remain in orders.

## Production checklist
- Configure TLS/reverse proxy and domain DNS.
- Use strong secrets; never commit `.env`.
- Configure payment provider credentials before enabling a gateway.
- Set real contact, shipping and social details in Admin → Site Settings.
- Back up MongoDB volume regularly; Cloudinary is the media origin.
