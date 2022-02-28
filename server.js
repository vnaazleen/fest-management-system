const express = require("express")
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const dotenv = require('dotenv')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }))

// Passport & Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// Mongoose DB
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected to db')
    }
)

const User = require('./models/user')

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// Routers

const eventRouter = require("./routes/events")
const authRouter = require("./routes/auth")

app.use('/events', eventRouter)
app.use('/auth', authRouter)

app.get("/", (req, res) => {
    res.render('home', { pageTitle: "VIVA VVIT - Home", user: req.user})
})

app.get("/about", (req, res) => {
    res.render('aboutus', {user: req.user})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})