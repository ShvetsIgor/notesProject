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