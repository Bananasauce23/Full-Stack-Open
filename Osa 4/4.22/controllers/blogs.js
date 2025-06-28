const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
    response.json(blogs);
});

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null
}

blogsRouter.post('/', async (request, response) => {
    const token = request.token;
    const user = request.user;
    
    if (!token) {
        return response.status(401).json({ error: 'token missing' });
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        return response.status(401).json({ error: 'token invalid'});
    }
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    if (!user) {
        return response.status(400).json({ error: 'UserId missing or not valid'});
    }

    const { title, url, likes } = request.body;
    const blog = new Blog({
        title,
        author: user.name,
        url,
        likes: likes || 0,
        user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
    const token = request.token;
    const user = request.user;
    
    if (!token) {
        return response.status(401).json({ error: 'token missing' });
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        return response.status(401).json({ error: 'token invalid' });
    }

    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ error: 'malformatted id' });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).json({error: 'blog not found' });
    }

    if (blog.user.toString() !== decodedToken.id) {
        return response.status(403).json({ error: 'only the creator can delete the blog' });
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