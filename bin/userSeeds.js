require('dotenv').config();

const mongoose = require("mongoose");

const User = require("../models/User");

mongoose.Promise = Promise;
mongoose
.connect(process.env.database_url, {useMongoClient: true})
.then(() => {
console.log('Connected to Mongo!')
}).catch(err => {
console.error('Error connecting to mongo', err)
});

const users = [
    {
        nickname: "Tonto",
        email: "tonto@gmail.com",
        encryptedPassword: "$2a$10$g.Ssyh1SyO244CU701K/lOkAHoIdMs3TP.g7kgARGuh15uZMn2PUi",
        role: "normal"
    },
    {
        nickname: "Jahson",
        email: "jahson@gmail.com",
        encryptedPassword: "$2a$10$g.Ssyh1SyO244CU701K/lOkAHoIdMs3TP.g7kgARGuh15uZMn2PUi",
        role: "normal"
    },
    {
        nickname: "Nyah Man",
        email: "nyah@gmail.com",
        encryptedPassword: "$2a$10$g.Ssyh1SyO244CU701K/lOkAHoIdMs3TP.g7kgARGuh15uZMn2PUi",
        role: "normal"
    },
    {
        nickname: "Steo",
        email: "steo@gmail.com",
        encryptedPassword: "$2a$10$g.Ssyh1SyO244CU701K/lOkAHoIdMs3TP.g7kgARGuh15uZMn2PUi",
        role: "normal"
    },
    {
        nickname: "Clem Dub",
        email: "clemdub@gmail.com",
        encryptedPassword: "$2a$10$g.Ssyh1SyO244CU701K/lOkAHoIdMs3TP.g7kgARGuh15uZMn2PUi",
        role: "admin"
    }
];


User.create(users)
.then( () => {
    console.log(`Created ${users.length} fake users`);
})
.catch( (err) => {
    console.log(`Error connecting to mongo`, err);
});