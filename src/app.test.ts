import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from './app.ts';
import type {Task} from './task.ts';


test('GET /tasks returns created task', async () => {

    const app = createApp();
    const textOfCheck = 'checking';

    const created = await request(app).post('/tasks').send({
        text: textOfCheck,
        scheduledAt: '2026-08-08T18:00:00+03:00'
    }).expect(201).expect('Content-Type', /json/);

    const createdId = created.body.id;

    const response = await request(app).get('/tasks').expect('Content-Type', /json/).expect(200);

    const found = response.body.find((task: Task) => task.id === createdId);

    assert.ok(found);

    assert.equal(found.text, textOfCheck);
})

test('GET /tasks returns an empty list', async () => {
    const app = createApp();

    const response = await request(app)
    .get('/tasks')
    .expect('Content-Type', /json/)
    .expect(200);

    assert.deepEqual(response.body, []);
})

test('POST /tasks creates a pending task', async () => {
    const app = createApp();

    const response = await request(app)
    .post('/tasks')
    .send({
        text: 'Review HTTP contracts',
        scheduledAt: '2026-08-08T18:00:00+03:00'
    })
        .expect(201)
        .expect('Content-Type', /json/);

    const { id, ...rest } = response.body; 
    
    // The server generates id, so only its type is part of the contract
    assert.equal(typeof id, 'string');

    assert.deepEqual(rest, {
        text: 'Review HTTP contracts',
        scheduledAt: '2026-08-08T18:00:00+03:00',
        status: 'pending'
    });
})

test('POST /tasks rejects a request without text', async () => {
    const app = createApp();

    const response = await request(app).post('/tasks').send({
        scheduledAt: '2026-08-08T18:00:00+03:00'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects a non-string text', async () => {
    const app = createApp();

    const response = await request(app).post('/tasks').send({
        text: 123,
        scheduledAt: '2026-08-08T18:00:00+03:00'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects a request without scheduledAt', async () => {
    const app = createApp();

    const response = await request(app).post('/tasks').send({
        text: 'checking'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects a non-string scheduledAt', async () => {
    const app = createApp();

    const response = await request(app).post('/tasks').send({
        text: 'checking',
        scheduledAt: 123
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})

test('POST /tasks rejects an invalid scheduledAt', async () => {
    const app = createApp();

    const response = await request(app).post('/tasks').send({
        text: 'checking',
        scheduledAt: 'not-a-date'
    }).expect(400).expect('Content-Type', /json/);

    assert.equal(typeof response.body.error, 'string');
})
