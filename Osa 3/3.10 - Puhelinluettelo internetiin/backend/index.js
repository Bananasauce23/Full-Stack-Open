require('dotenv').config()
const express = require("express")
const Person = require('./models/person')
const morgan = require("morgan")
const mongoose = require('mongoose')
const app = express()
morgan.token("body", (request) => JSON.stringify(request.body))

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(express.static("dist"))
app.use(express.json())

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request, response) => {
    const time = new Date()
    response.send(`Phonebook has info for ${persons.length} people<br>${time}`)
})

app.get(`/api/persons/:id`, (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: "Name or number is missing"})
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({error: "Name must be unique"})
    }

    const person = {
        id: Math.floor(Math.random() * 100000).toString(),
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})