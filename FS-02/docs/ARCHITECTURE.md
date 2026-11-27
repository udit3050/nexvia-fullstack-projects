# Architecture

```text
React client
  | REST + JWT                  WebSocket (Yjs)
  v                             v
Express API                 y-websocket server
  |                             |
  v                             v
PostgreSQL / Prisma         Y.Doc + CRDT state
  |-- users                   |-- concurrent text updates
  |-- workspaces              |-- awareness/presence
  |-- memberships
  |-- pages / snapshots / comments
```

Yjs CRDT updates merge concurrent edits without last-write-wins overwrites. The y-websocket provider handles synchronization and awareness between connected clients. PostgreSQL stores workspace metadata, membership, comments and explicit snapshots.
