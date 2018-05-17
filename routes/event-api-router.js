const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Tune = require('../models/Tune');
const User = require("../models/User");
const Info = require("../models/Info");
const WatchIt = require("../models/WatchIt");
const router = express.Router();

// GET /api/events
router.get('/events', (req, res, next) => {
    Event
    .find({ status: "displayed" })
    .sort({ createdAt: 1 })
    .limit(1)
    .populate('admin')
    .populate('winner')
    .populate('winner1')
    .populate('winner2')
    .populate('winner3')
    .populate('scores1.selecta')
    .populate('scores2.selecta')
    .populate('scores3.selecta')
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
    .populate('winner')
    .populate('winner1')
    .populate('winner2')
    .populate('winner3')
    .populate('scores1.selecta')
    .populate('scores2.selecta')
    .populate('scores3.selecta')
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


// GET /api/archives/events/:eventId/round/:roundId
router.get('/archives/events/:eventId/round/:roundId', (req, res, next) => {
    const eventId = req.params.eventId;
    const roundId = req.params.roundId;
    // console.log('eventId : ' + eventId + ', roundId : ' + roundId);

    Event
    .findById(eventId)
    .populate('admin')
    .populate('winner')
    .populate('winner1')
    .populate('winner2')
    .populate('winner3')
    .populate('scores1.selecta')
    .populate('scores2.selecta')
    .populate('scores3.selecta')
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


// GET /api/events/:eventId
router.get('/events/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;

    Event
    .findById(eventId)
    .populate('admin')
    .populate('winner')
    .populate('winner1')
    .populate('winner2')
    .populate('winner3')
    .populate('scores1.selecta')
    .populate('scores2.selecta')
    .populate('scores3.selecta')
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
    // .then(() => {
    //     return User.updateMany( { $set: { game: newGame } } );
    //  })
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
    var finalScoresTemp = 0;
    var finalWinner;
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

                Event.findOneAndUpdate(
                    {  _id: eventId, 'scores1.selecta': selectaId },
                    { $set:  { 'scores1.$.score': score }},
                    {new: true}
                )
                .then((e) => {
                    console.log("WOOP_________________", e.scores1)
                    console.log("_____________________", event.scores1)
                })
                .catch((err) => {
                    next(err);
                });
            }

            console.log('ROUND 1 WINNER IS : ' + roundWinner);

            Event.findByIdAndUpdate(eventId, {$set: { winner1: roundWinner, 'rounds.1.status': 'displayed' }})
            .then((upEvent) => {

                const watchit = {
                    type: 'winRound',
                    user: roundWinner,
                    event: eventId,
                    roundNumber: 1
                }

                return WatchIt.create(watchit);
            })
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

    if(roundPos == 1) {
        Event.findOneAndUpdate({ 'rounds._id': roundId }, {$set: { 'rounds.1.status': "closed" }})
        .then((event) => {
            // console.log(event.nbSelectas);
            eventId = event._id;
            const isFinal = event.rounds[1].isFinal;
            console.log('IS FINAL : ' + isFinal);
            console.log('----------------------------------------------------------------------');

            if(isFinal) {
                for(var i = 0; i < event.nbSelectas; i++) {
                    // console.log(event.rounds[0].sets[i].score);
                    console.log(event.rounds[1].sets[i].selecta);
                    var score = event.rounds[1].sets[i].score;
                    var selectaId = event.rounds[1].sets[i].selecta;
                    var scoreRd1 = event.scores1[i].score;
                    var finalScore = score + scoreRd1;

                    console.log('BEFORE ----------------------------------');
                    console.log('score : ' + score);
                    console.log('scoresTemp : ' + scoresTemp);
                    console.log('roundWinner : ' + roundWinner);
                    console.log('selectaId : ' + selectaId);

                    // set the round winner
                    if(score > scoresTemp) {
                        roundWinner = selectaId;
                        scoresTemp = score;
                    }
                    // set the final winner
                    if(finalScore > finalScoresTemp) {
                        finalWinner = selectaId;
                        finalScoresTemp = finalScore;
                    }

                    console.log('AFTER ----------------------------------');
                    console.log('score : ' + score);
                    console.log('scoresTemp : ' + scoresTemp);
                    console.log('roundWinner : ' + roundWinner);
                    console.log('selectaId : ' + selectaId);

                    Event.findOneAndUpdate(
                        {  _id: eventId, 'scores2.selecta': selectaId },
                        { $set:  { 'scores2.$.score': score }},
                        {new: true}
                    )
                    .then((e) => {
                        console.log("WOOP_________________", e.scores2)
                        console.log("_____________________", event.scores2)
                    })
                    .catch((err) => {
                        next(err);
                    });
                }

                console.log('ROUND 2 WINNER IS : ' + roundWinner);
                console.log('----------------------------------------------------------------------');

                // if(isFinal) {
                Event.findByIdAndUpdate(eventId, {$set: { winner2: roundWinner , winner: finalWinner, status: 'closed'}}, {new: true})
                .then((upEvent) => {

                    const watchit = {
                        type: 'winClash',
                        user: finalWinner,
                        event: eventId
                    }

                    return WatchIt.create(watchit);
                })
                .then(() => {
                    return User.updateMany( { $set: { game: newGame } } );
                })
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    next(err);
                });
            }


            // else {
            //     Event.findByIdAndUpdate(eventId, {$set: { winner2: roundWinner, 'rounds.2.status': 'displayed' }}, {new: true})
            //     .then(() => {
            //        return User.updateMany( { $set: { game: newGame } } );
            //     })
            //     .then((result) => {
            //         res.json(result);
            //     })
            //     .catch((err) => {
            //         next(err);
            //     });
            // }

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