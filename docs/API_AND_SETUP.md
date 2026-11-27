# API & Local Setup

> Route inventory below is a guide to the application areas. Confirm exact paths in each server's `src/index.ts` before integrating external clients.

## FS-01

Base URL: `https://nexvia-fs01-api-m4ix.onrender.com`

Frontend: `https://nexvia-fs01-web-m4ix.onrender.com`

Health check: `GET /api/health`

Feature areas: authentication/registration, vendor product management, product browsing/search, cart, orders, reviews, coupons and administrative operations. Use the route handlers in `FS-01/server/src/index.ts` as the authoritative request/response contract.

## FS-02

Base URL: `https://nexvia-fs02-api-m4ix.onrender.com`

Frontend: `https://nexvia-fs02-web-m4ix.onrender.com`

Yjs WebSocket service: `wss://nexvia-fs02-yjs-m4ix.onrender.com`

Health check: `GET /api/health`

Feature areas: workspace/document metadata, access permissions, collaborative editing, comments/snapshots where implemented, and Yjs real-time synchronization. Check `FS-02/server/src/index.ts` and the Yjs server entry point for exact paths and payloads.

## Local setup

Requirements: Node.js LTS, npm, PostgreSQL. Valkey/Redis is optional for local features that use cache.

For each project, in its server folder:
1. `npm install`
2. Copy `.env.example` to `.env` and fill local values.
3. `npx prisma generate`
4. `npx prisma migrate dev`
5. `npm run dev`

In its client folder:
1. `npm install`
2. Configure the API URL using the environment variable documented in that client's `.env.example`.
3. `npm run dev`

Do not commit real secrets. Use test credentials and sandbox payment keys only.
