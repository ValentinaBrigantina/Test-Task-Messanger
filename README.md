# Test-Task-Messenger


## Stack

- Bun
- Hono, Hono RPS
- TypeScript
- Drizzle ORM
- PosgreSQL
- WebSocket
- Zod (validator)

Client:
- React 18
- Vite
- Tanstack Router, Query, and Form
- Tailwind

## To install dependencies and run API:

```bash
touch .env | cp .env.example .env // to create env
bun install // to install dependencies
bun dev // to run
```

## To install dependencies and run CLIENT:

```bash
touch frontend/.env | cp frontend/.env.example frontend/.env // to create env
cd frontend // move to directory
bun install // to install dependencies
bun dev // to run
```

## To run DataBase:

```bash
bun db:generate // to generate a schema 
bun db:up // run docker container with database
bun db:migrate // for schema migration
bun db:studio // launch Drizzle Studio https://local.drizzle.studio
```

#### notes
For create Admin
```bash
curl -X POST http://localhost:3000/api/admin/create \
-H "Content-Type: application/json" \
-d '{"name": "Admin", "password": "Admin"}'
```