const { test, beforeEach, after} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

let token;

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
    await User.deleteMany({});

    const userResponse = await api.post('/api/users').send({
        username: 'test',
        name: 'Test',
        password: 'password'
    });

    const user = await User.findOne({ username: 'test' });

    const loginResponse = await api.post('/api/login').send({
        username: 'test',
        password: 'password'
    });

    token = loginResponse.body.token;

    const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: user._id }));
    await Blog.insertMany(blogsWithUser);
});

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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToDelete = blogsAtStart.body[0];

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

    const blogsAtEnd = await api.get('/api/blogs');
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1);

    const ids = blogsAtEnd.body.map(b => b.id);
    assert.ok(!ids.includes(blogToDelete.id));
})

test('a blog\'s likes can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToUpdate = blogsAtStart.body[0];

    const updatedData = { likes: blogToUpdate.likes + 1 };

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, updatedData.likes);
})

test ('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
        title: 'Unauthorized',
        author: 'No Token',
        url: 'http://notoken.com',
        likes: 1
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401);
});

after(async () => {
    await mongoose.connection.close()
})