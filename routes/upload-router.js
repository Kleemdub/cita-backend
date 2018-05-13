const express = require("express");
const mongoose = require('mongoose');
const passport = require('passport');
const User = require("../models/User");
const multer = require('multer');
const router = express.Router();
const path = require('path');
const FormData = require("form-data");
const url = require("url");
const fs = require("fs");
const Event = require('../models/Event');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  }
});
const upload = multer({ storage });

// var storage = multer.memoryStorage();
// var upload = multer({ storage: storage });

// POST /api/upload
// /api/upload/event/:eventId/round/:roundId/user/:userId
router.post('/upload/event/:eventId/round/:roundId/user/:userId', upload.single('file'), (req, res, next) => {
    const { name, description, nickname } = req.body;
    const eventId = req.params.eventId;
    const userId = req.params.userId;
    var selecta = mongoose.Types.ObjectId(userId);
    const roundId = req.params.roundId;
    const score = 0;
    const title = nickname + " " + name;


    const newFileName = req.file.filename;

    const set = {
        selecta,
        title,
        description,
        score
    };

    console.log(set);

    if(roundId == 0){
        Event.findByIdAndUpdate(eventId, {$push: { "rounds.0.sets": set }}, {new: true} )
        .then((updatedEvent) => {
            console.log(updatedEvent);
            return mixcloudUpload(newFileName, title);
        })
        .catch((err) => {
            next(err);
        });
    }
    else if(roundId == 1){
        Event.findByIdAndUpdate(eventId, {$push: { "rounds.1.sets": set }}, {new: true} )
        .then((updatedEvent) => {
            console.log(updatedEvent);
            return mixcloudUpload(newFileName, title);
        })
        .catch((err) => {
            next(err);
        });
    }
    else if(roundId == 2){
        Event.findByIdAndUpdate(eventId, {$push: { "rounds.2.sets": set }}, {new: true} )
        .then((updatedEvent) => {
            console.log(updatedEvent);
            return mixcloudUpload(newFileName, title);
        })
        .catch((err) => {
            next(err);
        });
    }

    function mixcloudUpload(newFileName, name) {

        const form = new FormData();
        const mixUrl = url.parse("https://api.mixcloud.com//upload/?access_token=" + process.env.mixCloudAccessToken);
        const mp3Stream = fs.createReadStream('./public/uploads/' + newFileName);
        form.append("mp3", mp3Stream);
        form.append("name", name);
        form.submit(mixUrl, function (err, mixcloudResult) {
            if (err) {
                return res.json({
                    message: 'Sorry, something went wrong. Please try again later.',
                    isUploaded: false,
                    set: set
                });
            }
            console.log(mixcloudResult);
            return res.json({
                message: 'Your set is uploaded',
                isUploaded: true,
                set: set
            });
        });
    }

    // console.log(req.file);
    // console.log(req.body);

    // const form = new FormData();
    // const mixUrl = url.parse("https://api.mixcloud.com//upload/?access_token=" + process.env.mixCloudAccessToken);
    // const mp3Stream = fs.createReadStream('./public/uploads/' + req.file.filename);
    // form.append("mp3", mp3Stream);
    // form.append("name", name);
    // form.submit(mixUrl, function (err, mixcloudResult) {
    //     if (err) {
    //         return res.json({
    //             message: 'Sorry, something went wrong. Please try again later.',
    //             isUploaded: false,
    //             set: set
    //         });
    //     }
    //     console.log(mixcloudResult);
    //     return res.json({
    //         message: 'Your set is uploaded',
    //         isUploaded: true,
    //         set: set
    //     });
    // });
});



// const FormData = require("form-data");
// const url = require("url");
// const fs = require("fs");

// const form = new FormData();
// const mixUrl = url.parse("https://api.mixcloud.com//upload/?access_token=" + process.env.mixCloudAccessToken);
// const mp3Stream = fs.createReadStream(req.file.something);

// form.append("mp3", mp3Stream);
// form.append(req.body.something);
// form.submit(mixUrl, function (err, mixcloudResult) {
//   if (err) {
//     next(err);
//     return;
//   }

//   res.json(mixcloudResult);
// });


// mixcloudResult Structure
// {
//   "result": {
//       "message": "Uploaded Blah: The Song",
//       "key": "/nizaroni/blah-the-song/",
//       "success": true
//   }
// }









module.exports = router;