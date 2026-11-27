# FS-01 — Multi-Vendor E-Commerce Marketplace

A full-stack marketplace MVP with customer, vendor and admin roles; JWT authentication; vendor onboarding; product management; search/filter/sort; cart; checkout/order lifecycle; commission calculation; reviews; coupons; invoice endpoint; and admin analytics.

## Stack
React + TypeScript + Vite + Tailwind CSS; Node.js + Express + TypeScript; PostgreSQL + Prisma; Redis; Docker.

## Run locally
1. Copy `server/.env.example` to `server/.env` (PowerShell: `Copy-Item server/.env.example server/.env`).
2. Start infrastructure: `docker compose up -d`.
3. Backend:
   ```bash
   cd server
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   ```
4. Frontend (new terminal):
   ```bash
   cd client
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173`.

Demo accounts (created by seed):
- Admin: `admin@nexvia.local` / `Password123!`
- Vendor: `vendor@nexvia.local` / `Password123!`
- Customer: `customer@nexvia.local` / `Password123!`

## Notes
- Checkout currently uses a clearly labelled test-payment simulation and calculates the platform commission; it does not move money or execute a real Razorpay/Stripe Connect split. Add and verify the provider's Connect/route-transfer flow before presenting it as a live split-payment integration.
- Product images accept image URLs in this MVP. For S3, configure an S3-compatible bucket and replace the upload adapter in `src/routes/products.ts`.
- Redis is required for the current cart implementation; keep the Redis service running from Docker Compose.
- Search currently uses PostgreSQL case-insensitive filtering. The service boundary is ready for Elasticsearch integration.
- API documentation: `docs/API.md`; architecture: `docs/ARCHITECTURE.md`.
