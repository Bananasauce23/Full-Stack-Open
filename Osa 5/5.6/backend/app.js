require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

const app = express()

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    mongoose.connect(process.env.TEST_MONGODB_URI || process.env.MONGODB_URI)
}

app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

module.exports = app