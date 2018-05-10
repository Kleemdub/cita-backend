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

// POST /api/events
router.post('/events', (req, res, next) => {
    console.log("-------------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------------");
    console.log(req.body);
    console.log("-------------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------------");

    const { title, admin, tags, nbSelectas, selectas, nbRounds, rounds, status } = req.body;

    Event.create({ title, admin, tags, nbSelectas, selectas, nbRounds, rounds, status })
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