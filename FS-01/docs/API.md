# API Reference

Base URL: `/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register customer/vendor |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Authenticated | Current user |
| POST | `/vendors/apply` | Customer/vendor | Vendor application |
| GET | `/products` | Public | Search, category filter, sort |
| POST | `/products` | Vendor/admin | Create product |
| PUT/DELETE | `/products/:id` | Owner/admin | Update/archive product |
| POST/GET | `/cart` | Authenticated | Add/read Redis cart |
| POST | `/checkout` | Authenticated | Test checkout, commission calculation |
| GET | `/orders` | Authenticated | List orders |
| PATCH | `/orders/:id/status` | Vendor/admin | Update fulfilment status |
| POST | `/products/:id/reviews` | Authenticated | Create review |
| POST | `/coupons/validate` | Public | Validate coupon |
| GET | `/admin/analytics` | Admin | Marketplace metrics |
| GET | `/orders/:id/invoice` | Owner/admin | Printable HTML invoice |

All authenticated endpoints accept `Authorization: Bearer <token>`.
