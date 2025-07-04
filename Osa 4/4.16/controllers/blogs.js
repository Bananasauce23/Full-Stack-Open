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

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes },
        { new: true, runValidators: true, context: 'query' }
    );
    if (updatedBlog) {
        response.json(updatedBlog);
    }
    else {
        response.status(404).end();
    }
})

module.exports = blogsRouter;