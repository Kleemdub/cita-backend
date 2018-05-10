const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Tune = require('../models/Tune');
const User = require("../models/User");
const router = express.Router();

// GET /api/admins/:adminId/events
router.get('/admins/:adminId/events', (req, res, next) => {
    
    const eventAdmin = req.params.adminId;
    // res.send(eventAdmin);
    console.log("***********************************************************");
    console.log(eventAdmin);
    console.log("***********************************************************");

    Event
    .find({ admin: eventAdmin })
    .sort({ createdAt: -1 })
    .populate('admin')
    .populate('selectas')
    .populate('rounds.selectas')
    .populate('rounds.sets.selecta')
    .populate('rounds.sets.tracklist')
    .then((events) => {
        console.log("***********************************************************");
        console.log(events);
        console.log("***********************************************************");
        res.json(events);
    })
    .catch((err) => {
        next(err);
    });
});



module.exports = router;