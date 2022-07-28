const mongoose = require('mongoose')

// const mongopw = process.env.local.MONGODB_PASSWORD
const mongopw = 'oSjmi10iJDqwItMV'

const url =
  `mongodb+srv://fullstack:${mongopw}@cluster0.7wu0l.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)