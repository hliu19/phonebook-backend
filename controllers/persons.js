const personsRouter = require('express').Router()
const Person = require('../models/person')

// Get entries
personsRouter.get('/', async (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

// Get entry by id
personsRouter.get('/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Add new entry
personsRouter.post('/', async (request, response) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  const savedPerson = await person.save()
  response.status(201).json(savedPerson)
})

// Delete entry by id
personsRouter.delete('/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
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