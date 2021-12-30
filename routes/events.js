const express = require('express')
const router = express.Router()

const Event = require('../models/event')


// --------------- EVENTS PAGES ---------------

// ---------- ALL EVNETS PAGE -----------------

router.get("/", async (req, res) => {
    res.render("events/events", { title: 'Events', events: await Event.find()})
})

// ---------- TECHNICAL EVNETS PAGE ------------

router.get("/tech", async (req, res) => {
    const events = await Event.find()
    const technicalEvents = events.filter(event => event.type)
    res.render("events/events", { title: 'Technical Events', events: technicalEvents})
})

// ---------- NON-TECHNICAL EVNETS PAGE ------------

router.get("/nontech", async (req, res) => {
    const events = await Event.find()
    const nonTechnicalEvents = events.filter(event => !event.type)
    res.render("events/events", { title: 'Non-Technical Events', events: nonTechnicalEvents})
})



// ---------- CREATING A NEW EVENT ---------------

router.get("/new", (req, res) => {
    const dummyEvent = new Event({
        title: "",
        image: "",
        description: "",
        type: 1
    })

    res.render("events/createEvent", { event : dummyEvent })
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

router.get("/:id", async (req, res) => {
    const event = await Event.findById(req.params.id)
    res.render("events/event", { event: event})
})

// ---------- UPDATING A EVENT ---------------
router.get("/edit/:id", async (req, res) => {
    const event = await Event.findById(req.params.id)
    res.render("events/createEvent", { event: event, operation: "edit"})
})

router.put("/:id", async (req, res) => {

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
})

// ---------- DELETING A EVENT ---------------

router.delete("/:id", async (req, res) => {
    await Event.findByIdAndDelete(req.params.id)
    res.redirect("/events")
})


module.exports = router