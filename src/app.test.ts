import assert from 'node:assert/strict';
import test, {after, beforeEach} from 'node:test';
import request from 'supertest';
import { createApp } from './app.ts';
import type {Task} from './task.ts';
import {createPool} from "./db.ts";

const pool = createPool();

beforeEach(() => pool.query('TRUNCATE TABLE tasks'));
after(() => pool.end());

const validTaskInput = {
    text: 'checking',
    scheduledAt: '2026-08-08T18:00:00+03:00'
};

const createTask = async (app: ReturnType<typeof createApp>, overrides = {}) => {
    const created =  await request(app).post('/tasks')
        .send({...validTaskInput, ...overrides})
        .expect(201).expect('Content-Type', /json/);

    return created.body;
}

test('GET /tasks returns created task', async () => {

    const app = createApp(pool);
    const textOfCheck = 'checking';
    const created = await createTask(app);

    const response = await request(app).get('/tasks').expect('Content-Type', /json/).expect(200);

    const found = response.body.find((task: Task) => task.id === created.id);

    assert.ok(found);
    assert.equal(found.text, textOfCheck);
})

test('GET /tasks returns an empty list', async () => {
    const app = createApp(pool);

    const response = await request(app)
    .get('/tasks')
    .expect('Content-Type', /json/)
    .expect(200);

    assert.deepEqual(response.body, []);
})

test('POST /tasks creates a pending task', async () => {
    const app = createApp(pool);

    const response = await request(app)
    .post('/tasks')
    .send({
        text: 'Review HTTP contracts',
        scheduledAt: '2026-08-08T18:00:00+03:00'
    })
        .expect(201)
        .expect('Content-Type', /json/);

    const { id, scheduledAt, ...rest } = response.body;
    
    // The server generates id, so only its type is part of the contract
    assert.equal(typeof id, 'string');

    assert.equal(new Date(scheduledAt).getTime(), new Date('2026-08-08T18:00:00+03:00').getTime())

    assert.deepEqual(rest, {
        text: 'Review HTTP contracts',
        status: 'pending'
    });
})

test('POST /tasks rejects a request without text', async () => {
    const app = createApp(pool);

    const response = await request(app).post('/tasks').send({
        scheduledAt: '2026-08-08T18:00:00+03:00'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects a non-string text', async () => {
    const app = createApp(pool);

    const response = await request(app).post('/tasks').send({
        text: 123,
        scheduledAt: '2026-08-08T18:00:00+03:00'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects a request without scheduledAt', async () => {
    const app = createApp(pool);

    const response = await request(app).post('/tasks').send({
        text: 'checking'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects a non-string scheduledAt', async () => {
    const app = createApp(pool);

    const response = await request(app).post('/tasks').send({
        text: 'checking',
        scheduledAt: 123
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects an invalid scheduledAt', async () => {
    const app = createApp(pool);

    const response = await request(app).post('/tasks').send({
        text: 'checking',
        scheduledAt: 'not-a-date'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('PATCH /tasks/:id marks a task as completed', async () => {
    const app = createApp(pool);
    const created = await createTask(app);
    const id = created.id;

    const completed = await request(app).patch(`/tasks/${id}`).send({
        status: 'completed',
    }).expect(200).expect('Content-Type', /json/);

    assert.equal(completed.body.status, 'completed')
})

test('PATCH /tasks/:id returns 404 for unknown id', async () => {

    const app = createApp(pool);

    const response = await request(app).patch('/tasks/does-not-exist').send({
        status: 'completed'
    }).expect(404).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('PATCH /tasks/:id rejects an unknown status', async () => {
    const app = createApp(pool);
    const created = await createTask(app);
    const createdId = created.id;

    const statusDoneSend = await request(app).patch(`/tasks/${createdId}`).send({
        status: 'done'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof statusDoneSend.body.error, 'string');
})

test('PATCH /tasks/:id rejects a missing status', async () => {
    const app = createApp(pool);
    const created = await createTask(app);
    const createdId = created.id;

    const noStatusSend = await request(app).patch(`/tasks/${createdId}`).send({})
        .expect(400).expect('Content-Type', /json/);

    assert.equal(typeof noStatusSend.body.error, 'string');
})

test('PATCH /tasks/:id can set status back to pending', async () => {

    const app = createApp(pool);
    const created = await createTask(app);
    const createdId = created.id;

    const setStatusToCompleted = await request(app).patch(`/tasks/${createdId}`).send({
        status: 'completed'
    }).expect(200).expect('Content-Type', /json/);

    const setStatusBackToPending = await request(app).patch(`/tasks/${createdId}`).send({
        status: 'pending'
    }).expect(200).expect('Content-Type', /json/);

    assert.equal(setStatusToCompleted.body.status, 'completed')
    assert.equal(setStatusBackToPending.body.status, 'pending');

})

test('POST /tasks rejects a request without a body', async () => {
    const app = createApp(pool);

    const created = await request(app).post('/tasks').expect(400).expect('Content-Type', /json/);

    assert.equal(typeof created.body.error, 'string');
})
