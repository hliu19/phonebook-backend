const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Person = require('../models/person')

beforeEach(async () => {
  await Person.deleteMany({})
  const personObj = helper.initialPersons.map(person => new Person(person))
  const promiseArray = personObj.map(person => person.save())
  await Promise.all(promiseArray)
})

test('a valid person can be added', async () => {
  const newPerson = {
    name: 'Travis',
    number: '11111'
  }
  await api.post('/api/persons').send(newPerson).expect(201).expect('Content-Type', /application\/json/)
  const response = await helper.personsInDb()
  const names = response.map(person => person.name)
  assert.strictEqual(response.length, helper.initialPersons.length + 1)
  assert(names.includes('Travis'))
})

test('person with no name is not added', async () => {
  const newPerson = {
    number: '412313'
  }

  await api.post('/api/persons').send(newPerson).expect(400)
  const response = await helper.personsInDb()
  assert.strictEqual(response.length, helper.initialPersons.length)
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two persons', async () => {
  const response = await helper.personsInDb()
  
  assert.strictEqual(response.length, helper.initialPersons.length)
})

test('the first person name is Bob', async () => {
  const response = await helper.personsInDb()
  const names = response.map(e => e.name)
  
  assert(names.includes('Bob'))
})

test('a specific person can be viewed', async () => {
  const persons = await helper.personsInDb()
  const personToView = persons[0]
  const resultPerson = await api.get(`/api/persons/${personToView.id}`).expect(200).expect('Content-Type', /application\/json/)
  
  assert.deepStrictEqual(resultPerson.body, personToView)
})

test('a person can be deleted', async () => {
  const persons = await helper.personsInDb()
  const personToDelete = persons[0]
  await api.delete(`/api/persons/${personToDelete.id}`).expect(204)

  const personsAfter = await helper.personsInDb()
  const names = personsAfter.map(person => person.name)

  assert(!names.includes(personToDelete.name))
  assert.strictEqual(personsAfter.length, helper.initialPersons.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})