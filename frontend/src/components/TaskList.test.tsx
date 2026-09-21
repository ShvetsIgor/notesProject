import type {Task} from "../task.ts";
import TaskList from "./TaskList.tsx";
import {render, screen} from "@testing-library/react";
import {expect, test, vi} from "vitest";
import userEvent from "@testing-library/user-event";

const pendingTask: Task = {
    id: '11111111-1111-1111-1111-111111111111',
    text: 'Buy milk',
    scheduledAt: '2026-09-21T09:00:00.000Z',
    status: 'pending',
};

const completedTask: Task = {
    id: '22222222-2222-2222-2222-222222222222',
    text: 'Call mom',
    scheduledAt: '2026-09-22T09:00:00.000Z',
    status: 'completed',
};

test('shows the button only for pending tasks', () => {

    render(<TaskList items={[pendingTask, completedTask]} onComplete={()=>{}}/>)

    expect(screen.getAllByRole('button', {name: 'Completed'})).toHaveLength(1);
})

test('calls onComplete with the task id', async () => {

    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<TaskList items={[pendingTask]} onComplete={onComplete}/>);

    await user.click(screen.getByRole('button', { name: 'Completed'}));

    expect(onComplete).toHaveBeenCalledWith(pendingTask.id);
})
