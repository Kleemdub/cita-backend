const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Tune = require('../models/Tune');
const User = require("../models/User");
const router = express.Router();

// GET /api/events
router.get('/events', (req, res, next) => {
    Event
    .find({ status: "displayed" })
    .sort({ createdAt: -1 })
    .populate('admin')
    .populate('selectas')
    .populate('rounds.selectas')
    .populate('rounds.sets.selecta')
    .populate('rounds.sets.tracklist')
    .then((events) => {
        res.json(events);
    })
    .catch((err) => {
        next(err);
    });
});

// GET /api/events/open
router.get('/events/open', (req, res, next) => {
    Event
    .find({ status: "open" })
    .sort({ createdAt: -1 })
    .populate('admin')
    .populate('selectas')
    .populate('rounds.selectas')
    .populate('rounds.sets.selecta')
    .populate('rounds.sets.tracklist')
    .then((events) => {
        res.json(events);
    })
    .catch((err) => {
        next(err);
    });
});

// GET /api/events/:eventId
router.get('/events/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;

    Event
    .findById(eventId)
    .populate('admin')
    .populate('selectas')
    .populate('rounds.selectas')
    .populate('rounds.sets.selecta')
    .populate('rounds.sets.tracklist')
    .then((event) => {
        // console.log(event);
        res.json(event);
    })
    .catch((err) => {
        next(err);
    });
});

// PUT /api/events/:eventId
router.put('/events/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;
    const { _id, nbRounds, nbRegistrations, nbSelectas } = req.body;
    console.log("***********************************************************");
    // console.log(req.body);
    console.log("Nombre rounds : " + nbRounds);
    console.log("Selecta id : " + _id);
    console.log("***********************************************************");

    const newRegistrations = nbRegistrations + 1;
    var newStatus = "open";
    if(newRegistrations == nbSelectas) {
        newStatus = "pending";
    }

    Event.findByIdAndUpdate(eventId, {$set: { registrations: newRegistrations, status: newStatus }, $push: { selectas: _id }}, {new: true} )
    .then(() => {

        if(nbRounds == 1) {
            Event.findByIdAndUpdate(eventId, { $push: { "rounds.0.selectas": _id }}, {new: true})
            .then((updatedEvent) => {
                res.json(updatedEvent);
            })
            .catch((err) => {
                next(err);
            });
        }

        else if(nbRounds == 2 || nbRounds == 3) {
            Event.findByIdAndUpdate(eventId, { $push: { "rounds.0.selectas": _id }})
            .then(() => {
                return Event.findByIdAndUpdate(eventId, { $push: { "rounds.1.selectas": _id }}, {new: true});
            })
            .then((updatedEvent) => {
                res.json(updatedEvent);
            })
            .catch((err) => {
                next(err);
            });
        }
    })
    .catch((err) => {
        next(err);
    });


    // res.json(req.body);
});

// POST /api/events
router.post('/events', (req, res, next) => {
    console.log("-------------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------------");
    console.log(req.body);
    console.log("-------------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------------");

    const { title, admin, tags, nbSelectas, selectas, nbRounds, rounds, status, registrations } = req.body;

    Event.create({ title, admin, tags, nbSelectas, selectas, nbRounds, rounds, status, registrations })
    .then((addedEvent) => {
        const newEvent = addedEvent._id;
        var newEventObj = mongoose.Types.ObjectId(newEvent);
        res.json(addedEvent);
        return newEventObj;
    })
    .then((newEventObj) => {
        console.log("***********************************************************");
        console.log(newEventObj);
        console.log("***********************************************************");

        return User.findByIdAndUpdate(admin, { $push: { eventAdmin: newEventObj }});
    })
    .catch((err) => {
        next(err);
    });

});

module.exports = router;