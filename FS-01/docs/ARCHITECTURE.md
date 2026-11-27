# Architecture

```text
Browser (React + TypeScript)
        |
        | HTTPS / JSON + JWT
        v
Express API (role-based middleware, Zod validation)
        |             |
        v             v
PostgreSQL/Prisma   Redis cart cache
        |
        +-- Users / Vendors / Products / Orders / Reviews / Coupons

Checkout boundary -> test payment adapter -> order record + commission
```

Security: password hashing with bcrypt, short-lived request validation, JWT authentication, role checks, Helmet headers, CORS allowlist and rate limiting. For production, add refresh-token rotation, CSRF strategy for cookie auth, audit logging, object-level authorization tests and a managed secrets store.
