const http = require('http')
const express = require('express')
var morgan = require('morgan')
const app = express()

const cors = require('cors')

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

let persons =
    [
        { 
          "id": 1,
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": 2,
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": 3,
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": 4,
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }
    ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
    
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => {
        return person.id === id
    })
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const person = request.body
    person.id = Math.floor(10000*Math.random())
    if (!person.name || !person.number) {
        return response.status(400).json({error: 'Name or number missing'})
    }
    else if ((persons.find(p1 => person.name==p1.name))) {
        return response.status(400).json({error: 'Name already exists'})
    }
    else {
        // morgan.token('id', function getId (req) {
        //     return req.name, req.number
        //   })
        persons.concat[person]
        response.json(person)
    }
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