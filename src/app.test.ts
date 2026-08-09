import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { app } from './app.ts';


test('GET /tasks returns an empty list', async () => {
    const response = await request(app)
    .get('/tasks')
    .expect('Content-Type', /json/)
    .expect(200);

    assert.deepEqual(response.body, []);
})

test('POST /tasks creates a pending task', async () => {
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