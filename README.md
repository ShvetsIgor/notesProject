# My Plans

A personal planner for notes and scheduled tasks.

## Current API:

- `GET /tasks` returns an empty JSON array.
- `POST /tasks` returns a new task object.

## Current limitations:

- `GET /tasks` returns an empty JSON array and does not show created tasks.
- Tasks are stored in memory and are lost when the server restarts.
- `text` is checked only as non-empty string.
- `scheduledAt` is not required to be in the future, so past dates are accepted.

## Current requirements:

- Node.js 24
- npm 11

## Commands:

- `npm install` installs the dependencies.
- `npm start` starts the API server.
- `npm run check` checks the TypeScript types.
- `npm test` runs the integration tests.
- `curl -i http://localhost:3050/tasks` sends a manual HTTP request.
- `curl -i -X POST http://localhost:3050/tasks -H 'Content-Type: application/json' -d '{"text":"Buy milk","scheduledAt":"2026-08-10T09:00:00+03:00"}'` sends a manual HTTP request with the body of response.
- `curl -i -X POST http://localhost:3050/tasks -H 'Content-Type: application/json' -d '{}'` sends a manual HTTP request that is rejected.
- `requests.http` contains ready HTTP requests for the built-in HTTP client in WebStorm or the REST Client extension in VS Code.

## Contracts:

- `GET /tasks`, status: `200`, body: `[]`
- `POST /tasks`, status: `201`, request: user sends text and scheduledAt entries, body: new task object with id in UUID format and status `pending`
- `POST /tasks`, status: `400`, body: `{ "error": string }` when `text` or `scheduledAt` is missing or is not a string or is not a valid date
