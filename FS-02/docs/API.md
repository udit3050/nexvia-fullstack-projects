# API Reference

Base URL `/api`; authenticated routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| POST/GET | `/workspaces` | Create/list workspaces |
| POST | `/workspaces/:id/members` | Add existing user with VIEW/COMMENT/EDIT role |
| POST | `/workspaces/:id/pages` | Create page |
| GET/PUT | `/pages/:id` | Read/update page metadata/content |
| POST/GET | `/pages/:id/snapshots` | Save/list version snapshots |
| POST/GET | `/pages/:id/comments` | Create/list comments |

WebSocket endpoint: `ws://localhost:1234`, room name `page-<pageId>`.
