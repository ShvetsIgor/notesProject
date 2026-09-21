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

- docker compose up -d --wait
- cd backend
- npm install
- npm run db:migrate
- npm start
- open the other terminal
- cd ../frontend
- npm install
- npm run dev

### Readme

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
