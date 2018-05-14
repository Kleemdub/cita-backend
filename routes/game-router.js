const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Tune = require('../models/Tune');
const User = require("../models/User");
const Info = require("../models/Info");
const router = express.Router();

// GET /api/game/check/:userId
router.get('/game/check/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const newGame = {
        bullet: 4,
        like: 8,
        bouse: 4
    }

    User.findById(userId)
    .then((user) => {
        if(user.game.bullet) {
            console.log('USER GAME EXISTS');
            console.log(user.game);
            res.json(user.game);
        }
        else {
            console.log('USER GAME DOES NOT EXIST');
            User.findByIdAndUpdate(userId, { game: newGame }, {new: true})
            .then((user) => {
                res.json(user.game);
            })
            .catch((err) => {
                next(err);
            });

        }
    })
    .catch((err) => {
        next(err);
    });
});

// PUT /api/game/like/:eventId/:roundId/:setId
router.put('/game/like/:eventId/:roundId/:setId', (req, res, next) => {
    const eventId = req.params.eventId;
    const roundId = req.params.roundId;
    const setIdx = req.params.setId;
    // console.log("Round Index : " + roundIdx);
    const userId = req.body.userId;
    // console.log(req.body);

    if(setIdx == 0) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.0.score': 1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.like': -1 }})
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
    else if(setIdx == 1) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.1.score': 1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.like': -1 }})
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
    else if(setIdx == 2) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.2.score': 1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.like': -1 }})
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
    else if(setIdx == 3) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.3.score': 1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.like': -1 }})
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
    else if(setIdx == 4) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.4.score': 1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.like': -1 }})
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

// PUT /api/game/bullet/:eventId/:roundId/:setId
router.put('/game/bullet/:eventId/:roundId/:setId', (req, res, next) => {
    const eventId = req.params.eventId;
    const roundId = req.params.roundId;
    const setIdx = req.params.setId;
    // console.log("Round Index : " + roundIdx);
    const userId = req.body.userId;
    // console.log(req.body);

    if(setIdx == 0) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.0.score': 3 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bullet': -1 }})
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
    else if(setIdx == 1) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.1.score': 3 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bullet': -1 }})
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
    else if(setIdx == 2) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.2.score': 3 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bullet': -1 }})
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
    else if(setIdx == 3) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.3.score': 3 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bullet': -1 }})
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
    else if(setIdx == 4) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.4.score': 3 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bullet': -1 }})
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

// PUT /api/game/bouse/:eventId/:roundId/:setId
router.put('/game/bouse/:eventId/:roundId/:setId', (req, res, next) => {
    const eventId = req.params.eventId;
    const roundId = req.params.roundId;
    const setIdx = req.params.setId;
    // console.log("Round Index : " + roundIdx);
    const userId = req.body.userId;
    // console.log(req.body);

    if(setIdx == 0) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.0.score': -1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bouse': -1 }})
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
    else if(setIdx == 1) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.1.score': -1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bouse': -1 }})
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
    else if(setIdx == 2) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.2.score': -1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bouse': -1 }})
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
    else if(setIdx == 3) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.3.score': -1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bouse': -1 }})
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
    else if(setIdx == 4) {
        Event.update(
            {  'rounds._id': roundId },
            // { $inc:  { 'rounds.0.sets.$.score': 1 }}
            { $inc:  { 'rounds.$.sets.4.score': -1 }}
        )
        .then(() => {
            User.findByIdAndUpdate(userId, { $inc: {'game.bouse': -1 }})
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









module.exports = router;