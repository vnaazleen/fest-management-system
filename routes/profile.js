const express = require("express")
const router = express.Router()

const User = require("../models/user")

router.get('/profile', (req, res) => {
    res.render('auth/profile', {user: req.user});
})

router.get('/profile/edit', (req, res) => {
    res.render('auth/editProfile', {user: req.user});
})

router.put('/profile/edit', async (req, res) => {
    console.log(req.body)

    await User.findByIdAndUpdate(req.user.id, {
        username: req.body.username,
        name: req.body.name,
        college: req.body.college,
        branch: req.body.branch,
        phone: req.body.phone
    })

    res.redirect("/profile")
})

router.delete('/profile', async (req, res) => {
    await User.findByIdAndDelete(req.user.id)
    res.redirect("/auth/logout")
})


module.exports = router