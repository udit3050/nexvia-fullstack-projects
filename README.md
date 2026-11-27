# Nexvia Full-Stack Projects

A two-project full-stack development portfolio containing a multi-vendor commerce marketplace and a real-time collaborative workspace.

## Projects

### FS-01 — Multi-Vendor E-Commerce Marketplace

A marketplace MVP with customer, vendor and admin roles.

**Core modules**
- JWT authentication and role-based access
- Vendor onboarding and product management
- Product search, filtering and sorting
- Shopping cart and checkout/order lifecycle
- Platform commission calculation, reviews, coupons and admin analytics

**Technology:** React, TypeScript, Vite, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma, Redis and Docker.

**Live frontend:** https://nexvia-fs01-web-m4ix.onrender.com  
**API:** https://nexvia-fs01-api-m4ix.onrender.com

### FS-02 — Real-Time Collaborative Workspace

A collaborative workspace MVP for creating workspaces and pages and editing shared documents.

**Core modules**
- Account authentication and workspace access levels
- Shared rich-text document editing
- Yjs CRDT synchronization over WebSockets
- Participant presence, comments and version snapshots

**Technology:** React, TypeScript, Vite, Node.js, Express, PostgreSQL, Prisma, Yjs, y-websocket and Docker.

**Live frontend:** https://nexvia-fs02-web-m4ix.onrender.com  
**API:** https://nexvia-fs02-api-m4ix.onrender.com  
**Yjs WebSocket:** wss://nexvia-fs02-yjs-m4ix.onrender.com

## Repository structure

```text
.
├── FS-01/       # Multi-Vendor E-Commerce Marketplace
├── FS-02/       # Real-Time Collaborative Workspace
├── docs/        # Architecture, API/setup, test notes and submission docs
├── DEPLOYMENT.md
└── README.md
```

Each project contains separate client and server applications with its own setup instructions.

## Run locally

See the project-specific guides:
- [FS-01 setup and details](./FS-01/README.md)
- [FS-02 setup and details](./FS-02/README.md)

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API and setup notes](./docs/API_AND_SETUP.md)
- [Test results](./docs/TEST_RESULTS.md)
- [Final presentation notes](./docs/FINAL_PRESENTATION.md)

## Implementation notes

This repository contains MVP implementations. Some production integrations remain future work and should not be described as complete:
- FS-01 checkout uses a test-payment simulation; real payment-provider split transfers are not enabled.
- FS-01 product image handling currently accepts image URLs; S3-compatible upload integration is not enabled.
- FS-01 search uses PostgreSQL filtering; Elasticsearch is not enabled.
- FS-02 Yjs persistence and multi-instance scaling require deployment-specific persistent storage and additional fanout configuration.

Deployment links indicate hosted frontends/APIs; they do not by themselves certify that every workflow has passed end-to-end testing. Refer to the test-results document for verification status.
