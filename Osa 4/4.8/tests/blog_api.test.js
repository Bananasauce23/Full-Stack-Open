const { test, beforeEach, after} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
    {
        title: 'Jokublogi1',
        author: 'Joku tekijä',
        url: 'http://esim.com/1',
        likes: 4
    },
    {
        title: 'Jokutoinen2',
        author: 'Joku toinen',
        url: 'http://jotain.com/2',
        likes: 3
    }
]

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
})

test('blogs are returned as json and correct amount', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.status, 200);
    assert.match(response.headers['content-type'], /application\/json/);
    assert.strictEqual(response.body.length, initialBlogs.length);
})

after(async () => {
    await mongoose.connection.close()
})