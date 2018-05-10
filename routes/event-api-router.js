const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Tune = require('../models/Tune');
const router = express.Router();

// GET /api/events
router.get('/events', (req, res, next) => {
    Event
    .find()
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
        res.json(addedEvent);
    })
    .catch((err) => {
        next(err);
    });

});

module.exports = router;