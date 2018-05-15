const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Tune = require('../models/Tune');
const User = require("../models/User");
const Info = require("../models/Info");
const router = express.Router();

// GET /api/events
router.get('/events', (req, res, next) => {
    Event
    .find({ status: "displayed" })
    .sort({ createdAt: 1 })
    .limit(1)
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

    const scoresObj = {
        selecta: _id,
        score: 0
    };

    var newStatus = "open";
    if(newRegistrations == nbSelectas) {
        newStatus = "pending";
    }

    Event.findByIdAndUpdate(eventId, {$set: { registrations: newRegistrations, status: newStatus }, $push: { selectas: _id, scores1: scoresObj, scores2: scoresObj, scores3: scoresObj }}, {new: true} )
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

// PUT /api/events/launch/:eventId
router.put('/events/launch/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;

    const newGame = {
        bullet: 4,
        like: 8,
        bouse: 4
    }

    // console.log('eventId : ' + eventId);
    Info.findOne()
    .then((result) => {
        // console.log(result.count);
        const infoId = result._id;
        const currentCount = result.count;
        const eventName = "Sound Clash #" + currentCount;
        console.log('eventId : ' + eventId);
        console.log('eventName : ' + eventName);
        return Event.findByIdAndUpdate(eventId, {title: eventName, status: 'displayed'});
        // return infoId;
    })
    .then(() => {
        // console.log(infoId);
        return Info.findOneAndUpdate({name: 'SoundClash Count'}, { $inc: { count: 1 }});
    })
    .then(() => {
        return User.updateMany( { $set: { game: newGame } } );
     })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        next(err);
    });
});

// PUT /api/events/close/round/:roundId/:roundPos
router.put('/events/close/round/:roundId/:roundPos', (req, res, next) => {
    const roundId = req.params.roundId;
    const roundPos = req.params.roundPos;
    // console.log('ID : ' + roundId + ', POS : ' + roundPos);
    // var newEventObj = mongoose.Types.ObjectId(newEvent);
    var scoresTemp = 0;
    var roundWinner;
    var eventId;

    const newGame = {
        bullet: 4,
        like: 8,
        bouse: 4
    }

    if(roundPos == 0) {
        Event.findOneAndUpdate({ 'rounds._id': roundId }, {$set: { 'rounds.0.status': "closed" }})
        .then((event) => {
            // console.log(event.nbSelectas);
            eventId = event._id;

            for(var i = 0; i < event.nbSelectas; i++) {
                // console.log(event.rounds[0].sets[i].score);
                console.log(event.rounds[0].sets[i].selecta);
                var score = event.rounds[0].sets[i].score;
                var selectaId = event.rounds[0].sets[i].selecta;

                console.log('BEFORE ----------------------------------');
                console.log('score : ' + score);
                console.log('scoresTemp : ' + scoresTemp);
                console.log('roundWinner : ' + roundWinner);
                console.log('selectaId : ' + selectaId);

                if(score > scoresTemp) {
                    roundWinner = selectaId;
                    scoresTemp = score;
                }

                console.log('AFTER ----------------------------------');
                console.log('score : ' + score);
                console.log('scoresTemp : ' + scoresTemp);
                console.log('roundWinner : ' + roundWinner);
                console.log('selectaId : ' + selectaId);

                Event.update(
                    {  'scores1.selecta': selectaId },
                    { $set:  { 'scores1.$.score': score }}
                )
                .then(() => {})
                .catch((err) => {
                    next(err);
                });
            }

            // (bookId, {user, status, $unset: {cache: 1}})
            Event.findByIdAndUpdate(eventId, {$set: { winner1: roundWinner, 'rounds.1.status': 'displayed' }})
            .then(() => {
               return User.updateMany( { $set: { game: newGame } } );
            })
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                next(err);
            });

        })
        .catch((err) => {
            next(err);
        });
    }

});


// CREATION DES EVENTS
// POST /api/events
router.post('/events', (req, res, next) => {
    console.log("-------------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------------");
    console.log(req.body);
    console.log("-------------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------------");

    const { title, admin, tags, nbSelectas, selectas, nbRounds, rounds, status, registrations, scores1, scores2, scores3  } = req.body;

    Event.create({ title, admin, tags, nbSelectas, selectas, nbRounds, rounds, status, registrations, scores1, scores2, scores3 })
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