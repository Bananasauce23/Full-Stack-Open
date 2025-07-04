const blogsRouter = require('express').Router()
const Blog = require('../models/blog');
const mongoose = require('mongoose');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const { title, url } = request.body;
    if (!title || !url) {
        return response.status(400).end();
    }
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ error: 'malformatted id' });
    }
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
})

module.exports = blogsRouter;