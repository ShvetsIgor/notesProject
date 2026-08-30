import express from 'express';
import type {Task} from './task.ts';
import {isNonEmptyString, isTaskStatus, isUuid} from "./validation.ts";
import type {Pool} from "pg";
import {randomUUID} from "node:crypto";

type TaskRow = {
    id: string;
    text: string;
    scheduled_at: Date;
    status: Task['status'];
}

function toTask (row: TaskRow): Task {
    return {
        id: row.id,
        text: row.text,
        scheduledAt: row.scheduled_at.toISOString(),
        status: row.status
    };
}

export function createApp(pool: Pool) {

    const app = express();
    app.use(express.json());


    app.get('/tasks', async (_request, response) => {

        const result = await pool.query<TaskRow>('SELECT id, text, scheduled_at, status FROM tasks ORDER BY scheduled_at');
        response.json(result.rows.map(toTask));
    });

    app.post('/tasks', async (request, response) => {
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

        const result = await pool.query<TaskRow>(
            'INSERT INTO tasks (id, text, scheduled_at, status) VALUES ($1, $2, $3, $4) RETURNING id, text, scheduled_at, status',
            [randomUUID(), text, scheduledAt, 'pending']
        );

        response.status(201).json(toTask(result.rows[0]));
    })

    app.patch('/tasks/:id', async (request, response) => {
        const {id} = request.params;
        const {status} = request.body ?? {};

        if (!isTaskStatus(status)) {
            return response.status(400).json({error: 'status must be either "pending" or "completed"'})
        }

        if (!isUuid(id))
            return response.status(404).json({error: 'format of id is not valid'})

        const result = await pool.query<TaskRow>(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING id, text, scheduled_at, status',
            [status, id]
        );

        if (result.rows.length === 0) {
            return response.status(404).json({error: 'task not found'});
        }

        response.json(toTask(result.rows[0]));
    })

    return app;
}
