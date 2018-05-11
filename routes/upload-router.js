const express = require("express");
const passport = require('passport');
const User = require("../models/User");
const multer = require('multer');
const router = express.Router();
const path = require('path');
const FormData = require("form-data");
const url = require("url");
const fs = require("fs");

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
router.post('/upload', upload.single('file'), (req, res, next) => {
    const { name } = req.body;
    // const { originalname, secure_url } = req.file;
    console.log(req.file);
    console.log(req.body);
    // console.log("secure_url" + secure_url);
    // res.send(req.file);

    const form = new FormData();
    const mixUrl = url.parse("https://api.mixcloud.com//upload/?access_token=" + process.env.mixCloudAccessToken);
    const mp3Stream = fs.createReadStream('./public/uploads/' + req.file.filename);
    // console.log(mp3Stream);
    form.append("mp3", mp3Stream);
    form.append("name", name);
    form.submit(mixUrl, function (err, mixcloudResult) {
      if (err) {
        next(err);
        return;
      }
      res.json(mixcloudResult);
    });



    // const form = new FormData();
    // const mixUrl = url.parse("https://api.mixcloud.com//upload/?access_token=" + process.env.mixCloudAccessToken);
    // const mp3Stream = fs.createReadStream(req.file.buffer);

    // form.append("mp3", mp3Stream);
    // form.append("name", name);
    // form.submit(mixUrl, function (err, mixcloudResult) {
    //   if (err) {
    //     next(err);
    //     return;
    //   }

    //   res.json(mixcloudResult);
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