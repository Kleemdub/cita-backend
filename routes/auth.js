const express = require("express");
const passport = require('passport');
const User = require("../models/User");
const Event = require("../models/Event");
const Tune = require("../models/Tune");

const router     = express.Router();
// const nodemailer =  require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;


//Signup route ////////////////////////////////////////////////////////

router.post("/signup", (req, res, next) => {
const { nickname, email, password } = req.body;

    if(password === "" || password.match(/[0-9]/) === null ){
        // res.redirect("/signup");
        const err = new Error("Username or password invalid");
        err.status = 400;
        next(err);
        return;
    }

    User.findOne({ nickname }, "nickname", (err, user) => {
        if(user !== null) {
            const err = new Error("Nickname already exist");
            err.status = 400;
            next(err);
            return;
        }
    });

    const newGame = {
        bullet: 4,
        like: 8,
        bouse: 4
    }

    const salt = bcrypt.genSaltSync(bcryptSalt); 
    const encryptedPassword = bcrypt.hashSync(password, salt)

    const newUser = new User({
        nickname,
        encryptedPassword: encryptedPassword,
        email: email,
        game: newGame
    });
  
    newUser.save((err) => {
        if (err) {
            next(err);
        } else {
            req.login(newUser, () => {
                newUser.encryptedPassword = undefined;
                res.json({ userInfo: newUser });
            });
        }
    });
    
});
  

//login Route //////////////////////////////////////////////////////////

router.post("/login", (req, res, next) => {
const {email, password} = req.body;

    User.findOne({ email })
    .then((userDetails)=>{
        if (!userDetails){
            const err = new Error("Log in failed");
            err.status = 400;
            next(err);
            return;
        }

        const { encryptedPassword } = userDetails;
        if(!bcrypt.compareSync(password, encryptedPassword)) {
            const err = new Error("Log in failed");
            err.status = 400;
            next(err);
            return;
        }

        req.login(userDetails, () =>{
            userDetails.encryptedPassword = undefined;
            res.json({ userInfo: userDetails });
        });
    })
    .catch((err) => {
    next(err);
    });
});
  
  
//logout route /////////////////////////////////////////////////////////

router.get("/logout", (req, res, next) => {
    req.logout();
    res.json({ userInfo: null });
});


//check login route ////////////////////////////////////////////////////

router.get("/checklogin", (req, res, next) => {
    if(req.user) {
        req.user.encryptedPassword = undefined;
    }
    res.json({ userInfo: req.user });
});

module.exports = router;
