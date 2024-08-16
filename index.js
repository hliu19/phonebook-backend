const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(morgan('combined'))
app.use(express.static('dist'))

let persons = [
    { 
      id: "1",
      name: "Bob", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello!</h1>')
})

app.get('/info', (request, response) => {
    let numOfPersons = persons.length
    let date = new Date()
    response.send(`<p>The phonebook has info for ${numOfPersons} people.<br>${date}<p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // Check if POST request is missing name and/or number
    if (!body.name || !body.number) {
        response.status(400).json({
            error: 'missing information'
        })
    }

    // Check if entry already exists
    const containsPerson = (name) => {
        return persons.some(person => person.name.toLowerCase() === name.toLowerCase())
    }

    if (containsPerson(body.name)) {
        response.status(400).json({
            error: "Person already exists"
        })
    }
    else {
        const newPerson = new Person({
            name: body.name,
            number: body.number,
        })
        newPerson.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server running on ' + PORT)
})