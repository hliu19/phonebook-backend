const personsRouter = require('express').Router()
const Person = require('../models/person')

// Get all entries
personsRouter.get('/', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

// Get a single entry by id
personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

// Add new entry
personsRouter.post('/', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

// Delete entry by id
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

// Update entry by id
personsRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new : true }).then(updatedPerson => {
    response.json(updatedPerson)
  }).catch(error => next(error))
})

module.exports = personsRouter