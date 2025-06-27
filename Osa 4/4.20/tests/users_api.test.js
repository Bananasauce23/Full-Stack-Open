const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    await api.post('/api/users').send({ username: 'uniqueuser', name: 'Name', password: 'secret' })
});

test('creation fails if username is too short', async () => {
    const result = await api
        .post('/api/users')
        .send({ username: 'ab', name: 'Name', password: 'secret'})
        .expect(400);
    assert.match(result.body.error, /at least 3 characters/);
});

test('creation fails if password is too short', async () => {
    const result = await api
        .post('/api/users')
        .send({ username: 'name', name: 'Name', password: '12'})
        .expect(400);
    assert.match(result.body.error, /at least 3 characters/);
});

test('creation fails if username is not unique', async () => {
    const result = await api
        .post('/api/users')
        .send({ username: 'uniqueuser', name: 'Name', password: 'secret'})
        .expect(400);
    assert.match(result.body.error, /unique/);
});

test('creation succeeds with valid data', async () => {
    const result = await api
        .post('/api/users')
        .send({ username: 'new', name: 'Name', password: 'secret'})
        .expect(201);
    assert.strictEqual(result.body.username, 'new');
});

after(async () => {
    await mongoose.connection.close();
});