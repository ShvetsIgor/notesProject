import type {Pool} from "pg";
import type {Task} from "./task.ts";
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

export async function getAllTasks (pool: Pool): Promise<Task[]> {

    const result = await pool.query<TaskRow>(
        'SELECT id, text, scheduled_at, status FROM tasks ORDER BY scheduled_at'
    );

    return result.rows.map(toTask)
}

export async function createTask (pool: Pool, text: string, scheduledAt: string): Promise<Task> {

    const result = await pool.query<TaskRow>(
        'INSERT INTO tasks (id, text, scheduled_at, status) VALUES ($1, $2, $3, $4) RETURNING id, text, scheduled_at, status',
        [randomUUID(), text, scheduledAt, 'pending']
    );

    return toTask(result.rows[0]);
}

export async function updateStatus (pool: Pool, {id, status}: {id: string, status: Task['status']}): Promise<Task | null> {

    const result = await pool.query<TaskRow>(
        'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING id, text, scheduled_at, status',
        [status, id]
    );

    return result.rows.length === 0? null: toTask(result.rows[0]);
}
