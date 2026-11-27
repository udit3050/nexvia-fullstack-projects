# FS-02 — Real-Time Collaborative Workspace

A collaborative workspace MVP with accounts, workspaces, pages, a shared rich-text document, Yjs CRDT synchronization over WebSockets, live participant presence, comments, snapshots and access levels.

## Stack
React + TypeScript + Vite; Express + TypeScript; PostgreSQL + Prisma; Yjs + y-websocket; Zod; Docker.

## Run locally
1. Copy `server/.env.example` to `server/.env` (PowerShell: `Copy-Item server/.env.example server/.env`).
2. Start PostgreSQL: `docker compose up -d`.
3. Server terminal:
   ```bash
   cd server
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```
4. In a third terminal, start the Yjs WebSocket service: `cd server && npm run yjs`.
5. Client terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
6. Open `http://localhost:5174`.

## Collaboration test
Open the same workspace/page in two browser windows. Changes sync through Yjs; the online indicator shows connected presence.

## Notes
- The Yjs WebSocket service is configured separately on port 1234 and uses the y-websocket LevelDB persistence directory `.yjs-data`. Keep a persistent disk/volume mounted at that path in deployment.
- Access roles are `VIEW`, `COMMENT`, and `EDIT`.
- Version snapshots store the editor content as JSON. This is an MVP snapshot mechanism, not a complete event-sourced history.
- Redis is included in Docker Compose as the next step for horizontal scaling. This starter runs one Yjs WebSocket instance; multi-instance Redis pub/sub fanout must be added before scaling the collaboration service horizontally.
