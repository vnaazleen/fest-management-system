const express = require("express")
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const dotenv = require('dotenv')
require('dotenv').config()

const eventRouter = require("./routes/events")
const authRouter = require("./routes/auth")
const mongoose = require("mongoose")

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/events', eventRouter)
app.use('/auth', authRouter)

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected to db')
    }
)

app.get("/", (req, res) => {
    res.render('home')
})

app.get("/about", (req, res) => {
    res.render('aboutus')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})