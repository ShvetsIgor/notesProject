# My Plans

A personal planner for notes and scheduled tasks.

### Stack

- node.js
- express
- TypeScript
- PostgreSQL
- Docker
- Vite
- React
- Tailwind CSS

### Structure

- backend/ - HTTP API on Express and PostgreSQL
- frontend/ - web client (React, Vite)
- db-init/ - database initialization scripts

### How to start

1. Install the dependencies:

```bash
   npm install
```

2. Copy `backend/.env.example` to `backend/.env` and `backend/.env.test`, then set the real values.


3. Start the database and create the schemas:

```bash
   npm run setup
```

4. Start the API server in one terminal:

```bash
   npm start
```

5. Start the web client in another terminal:

```bash
   npm run dev
```

Then open `http://localhost:5173`.

### Commands

- `npm test` runs the tests of both packages. The database must be running.
- `npm run check` checks the TypeScript types in both packages.
- `npm run db:up` starts the database, `npm run db:down` stops it and keeps the data.
- `npm run db:reset` deletes the stored data and starts the database from scratch. Run `npm run setup` after it.

### Readme

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
