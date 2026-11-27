# Nexvia Projects — 10-Minute Final Presentation

## Slide 1 — Title (0:30)
**Two Full-Stack Capstone Projects**  
FS-01 Multi-Vendor E-Commerce Marketplace · FS-02 Real-Time Collaborative Workspace

## Slide 2 — Problem (1:00)
- FS-01: Independent vendors need one marketplace to list products while customers shop in one place.
- FS-02: Distributed teams need to edit shared documents simultaneously without overwriting each other's changes.

## Slide 3 — Solution & user journeys (1:00)
- Marketplace: customer/vendor/admin roles, catalog, cart and order workflow.
- Workspace: workspace/document flow with collaborative rich-text editing and real-time updates.

## Slide 4 — Technology & architecture (1:30)
React + TypeScript clients; Node.js/Express APIs; PostgreSQL + Prisma; Yjs/WebSocket collaboration; Render deployment. Show `docs/ARCHITECTURE.md`.

## Slide 5 — FS-01 implementation (1:00)
Walk through authentication, vendor-owned products, browsing, cart and order data model. Explain commission/payment integration honestly: only describe real payment splitting if the live connected-account flow has been implemented and verified.

## Slide 6 — FS-02 implementation (1:00)
Show document editor, two-browser collaboration, Yjs merge behavior, and explain how the API and WebSocket service are separated.

## Slide 7 — Testing & results (1:00)
Present only completed smoke tests and evidence. Current checklist is in `docs/TEST_RESULTS.md`; fill in observed outcomes and attach screenshots/recording.

## Slide 8 — Challenges & decisions (1:00)
Discuss deployment configuration, TypeScript/build issues, API/client environment variables, database migrations, and concurrent editing. Explain fixes actually made.

## Slide 9 — Limitations & next steps (0:45)
Production-grade payment split, object storage, search indexing, robust persistence/scaling, automated integration tests, monitoring and security hardening should be listed only according to implementation status.

## Slide 10 — Individual reflection & Q&A (0:15)
Each contributor explains their actual ownership, one technical lesson, one challenge and one next improvement. Do not claim work owned by someone else.
