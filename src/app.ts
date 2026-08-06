import express from 'express';

export const app = express();

app.get('/tasks', (_request, response) => {
    response.json([]);
});