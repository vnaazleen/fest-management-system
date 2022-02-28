const mongoose = require('mongoose')
const { Schema } = mongoose

const eventSchema = new Schema({
    title: String,
    image: String,
    description: String,
    type: Number
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event