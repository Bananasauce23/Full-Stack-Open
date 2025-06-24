const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app