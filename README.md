# My Plans

A personal planner for notes and scheduled tasks.

## Current API:

- `GET /tasks` returns all created tasks.
- `POST /tasks` returns a new task object.
- `PATCH /tasks/:id` updates the status of a task by id.

## Current limitations:

- `text` is checked only as a non-empty string.
- `scheduledAt` is not required to be in the future, so past dates are accepted.

## Current requirements:

- Node.js 24
- npm 11
- Docker with Compose v2
- Copy `.env.example` to `.env` and `.env.test` and set the real values before starting.

## Commands:

- `npm install` installs the dependencies.
- `docker compose up -d --wait` starts the PostgreSQL database in the background and waits until it is ready.
- `npm run db:migrate` creates the database schema.
- `npm start` starts the API server.
- `docker compose down` stops the database and keeps the stored data.
- `npm run db:migrate:test` creates the same schema in the test database.
- `npm run check` checks the TypeScript types.
- `npm test` runs the integration tests.
- `curl -i http://localhost:3050/tasks` sends a manual HTTP request.
- `curl -i -X POST http://localhost:3050/tasks -H 'Content-Type: application/json' -d '{"text":"Buy milk","scheduledAt":"2026-08-10T09:00:00+03:00"}'` sends a manual HTTP request with the body of response.
- `curl -i -X POST http://localhost:3050/tasks -H 'Content-Type: application/json' -d '{}'` sends a manual HTTP request that is rejected.
- `requests.http` contains ready HTTP requests for the built-in HTTP client in WebStorm or the REST Client extension in VS Code.
- `curl -i -X PATCH http://localhost:3050/tasks/<id> -H 'Content-Type: application/json' -d '{"status":"completed"}'` marks a task as completed.

## Contracts:

- All responses return `scheduledAt` in ISO 8601 format in UTC, regardless of the time zone it was sent in.
- All unknown routes returns status: `404`, body: `{ "error": string }`.
- Any unexpected error returns status: `500`, body: `{ "error": string }`.
- `GET /tasks`, status: `200`, body: `Task[]`
- `POST /tasks`, status: `201`, request: user sends text and scheduledAt entries, body: new task object with id in UUID format and status `pending`
- `POST /tasks`, status: `400`, body: `{ "error": string }` when `text` or `scheduledAt` is missing or is not a string or is not a valid date
- `PATCH /tasks/:id`, status: `200`, body: the updated task
- `PATCH /tasks/:id`, status: `404`, body: `{ "error": string }` when the id is not a valid UUID or no task has this id
- `PATCH /tasks/:id`, status: `400`, body: `{ "error": string }` when status is missing or is not "pending" or "completed"
