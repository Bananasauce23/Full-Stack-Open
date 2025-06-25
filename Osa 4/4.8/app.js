require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    console.log(process.env.TEST_MONGODB_URI)
    mongoose.connect(process.env.TEST_MONGODB_URI || process.env.MONGODB_URI)
}

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app