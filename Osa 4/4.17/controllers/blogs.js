const blogsRouter = require('express').Router()
const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body;
    if (!title || !url) {
        return response.status(400).end();
    }
    const user = await User.findOne();
    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1});
    response.status(201).json(populatedBlog);
});

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