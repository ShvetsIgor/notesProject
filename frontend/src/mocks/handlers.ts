import { http, HttpResponse} from "msw";

export const taskFromServer = {
    id: '11111111-1111-1111-1111-111111111111',
    text: 'Buy milk',
    scheduledAt: '2026-09-21T09:00:00.000Z',
    status: 'pending',
};

export const handlers = [
    http.get('/api/tasks', () => {
        return HttpResponse.json([taskFromServer])
    }),

    http.post('/api/tasks', async ({ request }) => {
        const body = await request.json() as {text: string, scheduledAt: string};

        return HttpResponse.json({
            id: '22222222-2222-2222-2222-222222222222',
            text: body.text,
            scheduledAt: body.scheduledAt,
            status: 'pending',
        },
            { status: 201 })
    }),

    http.patch('/api/tasks/:id', async ({request, params}) => {
        const body = await request.json() as {status: string};

        return HttpResponse.json({
            ...taskFromServer,
            id: params.id,
            status: body.status
        })
    })
]
