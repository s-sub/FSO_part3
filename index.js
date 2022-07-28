require('dotenv').config()
const http = require('http')
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

// const Person = mongoose.model('Person', personSchema)

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)



let persons =
    [
      {
        'id': 1,
        'name': 'Arto Hellas',
        'number': '040-123456'
      },
      {
        'id': 2,
        'name': 'Ada Lovelace',
        'number': '39-44-5323523'
      },
      {
        'id': 3,
        'name': 'Dan Abramov',
        'number': '12-43-234345'
      },
      {
        'id': 4,
        'name': 'Mary Poppendieck',
        'number': '39-23-6423122'
      }
    ]

// app.get('/', (request, response) => {
//     response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

  // const id = Number(request.params.id)
  // const person = persons.find(person => {
  //     return person.id === id
  // })
  // if (person) {
  //     response.json(person)
  //   } else {
  //     response.status(404).end()
  //   }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number missing' })
  }
  else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const info = {
    contacts: persons.length,
    date: new Date()
  }
  response.send(`<p>Phonebook has info for ${info.contacts} people<p><p>${info.date}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})