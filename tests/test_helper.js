const Person = require('../models/person')

const initialPersons = [
  {
    name: 'Bob',
    number: '123',
  },
  {
    name: 'Alice',
    numner: '141',
  },
]

const nonExistingId = async () => {
  const person = new Person({ name: 'will remove this soon' })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map(person => person.toJSON())
}

module.exports = {
  initialPersons, nonExistingId, personsInDb
}