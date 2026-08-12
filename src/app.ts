import express from 'express';
import type {Task} from './task.ts';
import {randomUUID} from 'node:crypto';
import { isNonEmptyString } from "./validation.ts";

export function createApp() {

    const app = express();
    app.use(express.json());
    const tasks: Task[] = [];

    app.get('/tasks', (_request, response) => {
        response.json(tasks);
    });
    app.post('/tasks', (request, response) => {
        const {text, scheduledAt}: { text?: unknown, scheduledAt?: unknown } = request.body;

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

    return app;
}
