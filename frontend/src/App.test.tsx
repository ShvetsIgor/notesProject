import {test, expect} from 'vitest';
import {render, screen} from "@testing-library/react";
import App from "./App.tsx";
import userEvent from '@testing-library/user-event';
import {server} from "./mocks/node.ts";
import {http, HttpResponse} from "msw";
import {taskFromServer} from "./mocks/handlers.ts";

test('show tasks loaded from server', async () => {

    render(<App/>);
    expect(await screen.findByText(taskFromServer.text)).toBeInTheDocument();

})

test('creates a task from the form', async () => {

    const localDateTime = '2026-09-25T18:30';
    const newTaskText = 'Call mom';
    let requestBody: { text: string, scheduledAt: string } | undefined;

    server.use(
        http.get('/api/tasks', () => HttpResponse.json([])),
        http.post('/api/tasks', async ( {request}) => {
            requestBody = await request.json() as { text: string, scheduledAt: string}

            return HttpResponse.json(
            { id: '22222222-2222-2222-2222-222222222222', ...requestBody, status: 'pending' },
            { status: 201 }
            );
        })
    )

    const user = userEvent.setup();
    render(<App/>);

    expect(await screen.findByText('No tasks yet. Create your first task')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Task'), newTaskText);
    await user.type(screen.getByLabelText('When'), localDateTime);
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(await screen.findByText(newTaskText)).toBeInTheDocument();
    expect(requestBody?.text).toBe(newTaskText);
    expect(new Date(requestBody!.scheduledAt).getTime()).toBe(new Date(localDateTime).getTime());
})

test('marks the task as completed', async () => {

    let requestBody: {status: string} | undefined;

    server.use(
        http.patch('/api/tasks/:id', async ({request, params}) => {

            requestBody = await request.json() as { status: string };

            return HttpResponse.json(
                {...taskFromServer, id: params.id, status: 'completed'}
            )
        })
    )

    const user = userEvent.setup();
    render(<App/>);

    expect(await screen.findByText(taskFromServer.text)).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: 'Completed'}));

    expect(await screen.findByText('completed')).toBeInTheDocument();
    expect(requestBody?.status).toBe('completed');
})
