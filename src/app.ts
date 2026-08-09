import express from 'express';
import type { Task } from './task.ts';
import { randomUUID } from 'node:crypto';

export const app = express();

app.use(express.json());

const tasks: Task[] = [];

app.get('/tasks', (_request, response) => {
    response.json([]);
});
app.post('/tasks', (request, response) => {
    const { text, scheduledAt } = request.body;

    const task: Task = {
        id: randomUUID(),
        text,
        scheduledAt,
        status: 'pending'
    }

    tasks.push(task);

    response.status(201).json(task);

})