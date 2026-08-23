import express from 'express';
import type {Task} from './task.ts';
import {randomUUID} from 'node:crypto';
import {isNonEmptyString, isTaskStatus} from "./validation.ts";

export function createApp() {

    const app = express();
    app.use(express.json());
    const tasks: Task[] = [];

    app.get('/tasks', (_request, response) => {
        response.json(tasks);
    });
    app.post('/tasks', (request, response) => {
        const {text, scheduledAt}: { text?: unknown, scheduledAt?: unknown } = request.body ?? {};

        if (!isNonEmptyString(text)) {
            return response.status(400).json({error: 'text must be a non-empty string'});
        }

        if (!isNonEmptyString(scheduledAt)) {
            return response.status(400).json({error: 'scheduledAt must be a non-empty string'})
        }

        if (Number.isNaN(Date.parse(scheduledAt))) {
            return response.status(400).json({error: 'scheduledAt must be a valid ISO 8601 date'})
        }

        const task: Task = {
            id: randomUUID(),
            text,
            scheduledAt,
            status: 'pending'
        }

        tasks.push(task);
        response.status(201).json(task);
    })

    app.patch('/tasks/:id', (request, response) => {
        const {id} = request.params;
        const {status} = request.body ?? {};

        if (!isTaskStatus(status)) {
            return response.status(400).json({error: 'status must be either "pending" or "completed"'})
        }

        const task = tasks.find((task) => task.id === id);

        if (!task) {
            return response.status(404).json({error: 'task not found'});
        }

        task.status = status;
        response.json(task);
    })

    return app;
}
