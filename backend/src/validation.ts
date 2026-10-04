import type {Task} from "@my-plans/shared";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim() !== ''
}

export function isTaskStatus(value: unknown): value is Task['status'] {
    return (value === 'pending' || value === 'completed')
}

export function isUuid(value: unknown): value is string {
    return typeof value === "string" && UUID_PATTERN.test(value);
}

export function isFutureDate(value: string): boolean {

    const toleranceMs = 60 * 1000;

    return Date.parse(value) > Date.now() - toleranceMs;
}
