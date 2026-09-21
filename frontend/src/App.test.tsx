import {test, expect, vi, afterEach} from 'vitest';
import {render, screen} from "@testing-library/react";
import App from "./App.tsx";
import userEvent from '@testing-library/user-event';


const taskFromServer = {
    id: '11111111-1111-1111-1111-111111111111',
    text: 'Buy milk',
    scheduledAt: '2026-09-21T09:00:00.000Z',
    status: 'pending'
}

afterEach(() => {
    vi.unstubAllGlobals()
});

test('show tasks loaded from server', async () => {

    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve([taskFromServer])
        })
    ))

    render(<App/>);

    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
})

test('creates a task from the form', async () => {

    const localDateTime = '2026-09-25T18:30'
    const createdTask = {
        id: '11111111-1111-1111-1111-111111111111',
        text: 'Call mom',
        scheduledAt: localDateTime,
        status: 'pending',
    }

    const fetchMock = vi.fn( (url: string, options?: RequestInit) => {

        if (options?.method === 'POST') {
            return Promise.resolve({
                ok: true,
                json: () =>  Promise.resolve(createdTask)
            })
        }

        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
        })
    })

    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    render(<App/>);

    expect(await screen.findByText('No tasks yet. Create your first task')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Task'), 'Call mom');
    await user.type(screen.getByLabelText('When'), localDateTime);
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(await screen.findByText('Call mom')).toBeInTheDocument();

    const postCall = fetchMock.mock.calls.find(([, options]) => options?.method === 'POST');
    expect(postCall).toBeDefined();

    const [url, optons] = postCall!;
    expect(url).toBe('/api/tasks')

    const body = JSON.parse(optons?.body as string);
    expect(body.text).toBe('Call mom');
    expect(new Date(body.scheduledAt).getTime()).toBe(new Date(localDateTime).getTime());
})
