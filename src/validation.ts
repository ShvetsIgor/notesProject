import type {Task} from "./task.ts";

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim() !== ''
}

export function isTaskStatus(value: unknown): value is Task['status'] {
    return (value === 'pending' || value === 'completed')
}
