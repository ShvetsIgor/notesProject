# My Plans

A personal planner for notes and scheduled tasks.

## Current API:

- `GET /tasks` returns an empty JSON array.

## Current limitation:

- Creating tasks and storing data are not implemented yet.

## Current requirements:

- Node.js 24
- npm 11

## Commands:

- `npm install` installs the dependencies.
- `npm start` starts the API server.
- `npm run check` checks the TypeScript types.
- `npm test` runs the integration tests.
- `curl -i http://localhost:3050/tasks` sends a manual HTTP request.

## Contracts:

- `GET /tasks`, status: `200`, body: `[]`