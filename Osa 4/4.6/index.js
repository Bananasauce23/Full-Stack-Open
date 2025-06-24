require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})