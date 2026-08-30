import express from 'express';
import {isNonEmptyString, isTaskStatus, isUuid} from "./validation.ts";
import type {Pool} from "pg";
import {createTask, getAllTasks, updateStatus} from "./taskRepository.ts";

export function createApp(pool: Pool) {

    const app = express();
    app.use(express.json());

    app.get('/tasks', async (_request, response) => {

        response.json(await getAllTasks(pool));
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

        response.status(201).json(await createTask(pool, text, scheduledAt));
    })

    app.patch('/tasks/:id', async (request, response) => {
        const {id} = request.params;
        const {status} = request.body ?? {};

        if (!isTaskStatus(status)) {
            return response.status(400).json({error: 'status must be either "pending" or "completed"'})
        }

        if (!isUuid(id))
            return response.status(404).json({error: 'format of id is not valid'})

        const task = await updateStatus(pool, { status, id });

        if (task === null) {
            return response.status(404).json({error: 'task not found'});
        }

        response.json(task);
    })

    return app;
}
