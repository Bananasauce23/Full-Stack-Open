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

test('blogs have their id fields named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
        assert.notStrictEqual(blog.id, undefined);
        assert.strictEqual(blog._id, undefined);
    })
})

test('valid blog can be added', async () => {
    const newBlog = {
        title: 'New Blog',
        author: "Test",
        url: "http://test.com",
        likes: 7
    };

    const blogsAtStart = await api.get('/api/blogs');
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await api.get('/api/blogs');
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1);

    const titles = blogsAtEnd.body.map(b => b.title);
    assert.ok(titles.includes(newBlog.title));
})

test('when likes has no value make it 0', async () => {
    const newBlog = {
        title: 'No Likes Blog',
        author: 'No Likes Author',
        url: 'http://nolikes.com'
    };

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
})

test('when blog has no title return 400', async () => {
    const newBlog = {
        author: 'Author',
        url: 'http://esim.com'
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
})

test('when blog has no url return 400', async () => {
    const newBlog = {
        title: 'No URL',
        author: 'Author'
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToDelete = blogsAtStart.body[0];

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

    const blogsAtEnd = await api.get('/api/blogs');
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1);

    const ids = blogsAtEnd.body.map(b => b.id);
    assert.ok(!ids.includes(blogToDelete.id));
})

after(async () => {
    await mongoose.connection.close()
})