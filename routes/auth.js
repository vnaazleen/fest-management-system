const express = require('express')
const router = express.Router()

const passport = require("passport")
const User = require('../models/user')

router.get("/login", (req, res) => {
    if(req.isAuthenticated())
        res.redirect("/")
    else
        res.render("auth/login",{ user: req.user })
})


router.get("/register", (req, res) => {
    if(req.isAuthenticated())
        res.redirect("/")
    else
        res.render("auth/register", {user: req.user})
})

router.post("/register", async (req, res) => {

    console.log(req.body)

    User.register(({
        username: req.body.username,
        name: req.body.name,
        college: req.body.college,
        branch: req.body.branch,
        phone: req.body.phone,
    }), 
    req.body.password, 
    (err, user) => {
        if(err) {
            console.log(err)
            console.log(req.body.username);
            res.redirect('/auth/register')
        } else {
            passport.authenticate("local")(req, res, () => {
                console.log(user)
                res.redirect('/')
            })
        }
    })
})

router.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log(user)
            passport.authenticate("local")(req, res, () => {
                res.redirect('/')
            })
        }
    })
})

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router