const express = require('express')
const router = express.Router()

const Event = require('../models/event')
const User = require('../models/user')

// --------------- EVENTS PAGES ---------------

// ---------- ALL EVNETS PAGE -----------------

router.get("/", async (req, res) => {
    res.render("events/events", { title: 'Events', user: req.user, events: await Event.find()})
})

// ---------- TECHNICAL EVNETS PAGE ------------

router.get("/tech", async (req, res) => {
    const events = await Event.find()
    const technicalEvents = events.filter(event => event.type)
    res.render("events/events", { title: 'Technical Events', user: req.user, events: technicalEvents})
})

// ---------- NON-TECHNICAL EVNETS PAGE ------------

router.get("/nontech", async (req, res) => {
    const events = await Event.find()
    const nonTechnicalEvents = events.filter(event => !event.type)
    res.render("events/events", { title: 'Non-Technical Events', user: req.user, events: nonTechnicalEvents})
})



// ---------- CREATING A NEW EVENT ---------------

router.get("/new", (req, res) => {
    const dummyEvent = new Event({
        title: "",
        image: "",
        description: "",
        type: 1
    })

    res.render("events/createEvent", { event : dummyEvent, user: req.user, operation: "new" })
})

router.post("/new", async (req, res) => {

    const type = parseInt(req.body.type)

    // type = 0 means non-technical
    // type = 1 means technical
    
    const newEvent = new Event({
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        type: type
    })
    await newEvent.save()

    res.redirect("/events")
})


// ---------- READING A EVENT ---------------
router.get("/id/:id", async (req, res) => {
    const event = await Event.findById(req.params.id)
    let registered = false 

    if(req.user != null) {
        user = await User.findById(req.user.id).populate('registeredEvents')
        console.log(user)

        const event = await Event.findById(req.params.id)

        registered = user.registeredEvents.filter((event) => {
            return event.id == req.params.id
        }).length > 0

        console.log(registered)
    }

    res.render("events/event", { event: event, user: req.user, registered: registered})
})

// ---------- UPDATING A EVENT ---------------
router.get("/edit/:id", async (req, res) => {
    if(typeof req.user !== 'undefined' && req.user.admin) {
        const event = await Event.findById(req.params.id)
        res.render("events/createEvent", { event: event, user: req.user, operation: "edit"})
    } else {
        res.redirect("/events")
    }
})

router.put("/:id", async (req, res) => {
    if(typeof req.user !== 'undefined' && req.user.admin) {
        const type = parseInt(req.body.type)
    
        await Event.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                image: req.body.image,
                description: req.body.description,
                type: type
            }
        )

        res.redirect(`/events/${req.params.id}`)
    } else {
        res.redirect("/events")
    }
})

// ---------- DELETING A EVENT ---------------
router.delete("/:id", async (req, res) => {
    if(typeof req.user !== 'undefined' && req.user.admin) {
        await Event.findByIdAndDelete(req.params.id)
    }

    res.redirect("/events")
})

// ----------- REGISTER FOR A USER ------------
router.post("/register/:id", async (req, res) => {

    if(typeof req.user === 'undefined') {
        res.redirect("/auth/login")
    } else {

        User.findByIdAndUpdate(
            req.user.id,
            {
                $push: {
                    registeredEvents: req.params.id
                }, 
            },
            { new: true, useFindAndModify: false }
            , (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }
            }
        )

        Event.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    registeredUsers: req.user.id
                }
            },
            { new: true, useFindAndModify: false }, 
            (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }
            }
        )

        user = await User.findById(req.user.id).populate('registeredEvents')
        console.log(user)
    
        res.redirect("/events/id/" + req.params.id)
    }
})

// TODO: ----------- UNREGISTER USER FROM EVENT --------------------
router.post("/unregister/:id", async (req, res) => {

    if(typeof req.user === 'undefined') {
        res.redirect("/auth/login")
    } else {

        User.findByIdAndUpdate(
            req.user.id,
            {
                $pull: {
                    registeredEvents: req.params.id
                }, 
            },
            { new: true, useFindAndModify: false }
            , (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }
            }
        )

        Event.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    registeredUsers: req.user.id
                }
            },
            { new: true, useFindAndModify: false }, 
            (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }
            }
        )

        user = await User.findById(req.user.id).populate('registeredEvents')
        console.log(user)
    
        res.redirect("/events/id/" + req.params.id)
    }
})

// ------------ GET USER'S EVENTS --------------
router.get("/myEvents", async (req, res) => {
    console.log("In my events")
    if(typeof req.user === 'undefined') {
        res.redirect("/auth/login")
    } else {
        user = await User.findById(req.user.id).populate('registeredEvents')
        console.log(user)

        res.render("events/myEvents", { title: 'My Events', user: req.user, events: user.registeredEvents })
    }
})


module.exports = router