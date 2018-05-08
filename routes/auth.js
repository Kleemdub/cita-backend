const express = require("express");
const passport = require('passport');
// const authRoutes = express.Router();
const User = require("../models/User");

const router     = express.Router();
// const nodemailer =  require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
// const bcryptSalt = 10;


//Signup route ////////////////////////////////////////////////////////

router.get("/signup", (req, res, next) => {
// res.render('auth/signup');
});
  
router.post("/process-signup", (req, res, next) => {
const { nickname, email, password } = req.body;

    if(password === "" || password.match(/[0-9]/) === null ){
        res.redirect("/signup");
        return;
    }

    const salt = bcrypt.genSaltSync(10); 
    const encryptedPassword = bcrypt.hashSync(password, salt)

    User.create({ nickname, email, encryptedPassword })
    .then(()=>{
        res.redirect("/login");
    })
    .catch((err) => {
        next(err);
    });
});
  
//login Route //////////////////////////////////////////////////////////

router.get("/login", (req, res, next) =>{
// res.render("auth/login");
});
  
router.post("/process-login", (req, res, next) => {
const {email, password} = req.body;

    User.findOne({ email })
    .then((userDetails)=>{
        if (!userDetails){
            res.redirect("/login");
            return;
        }
        
        const { encryptedPassword } = userDetails;
        if(!bcrypt.compareSync(password, encryptedPassword)) {
            res.redirect("/login");
            return
        }
        
        req.login(userDetails, () =>{
            res.redirect("/");
        });
    })
    .catch((err) => {
    next(err);
    });

});
  
  
//logout route /////////////////////////////////////////////////////////

router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/signup");
});


module.exports = router;
