require('dotenv').config();

const mongoose = require("mongoose");

const Info = require("../models/Info");

mongoose.Promise = Promise;
mongoose
.connect(process.env.database_url, {useMongoClient: true})
.then(() => {
console.log('Connected to Mongo!')
}).catch(err => {
console.error('Error connecting to mongo', err)
});

const infos = [
    {
        count: 1,
        name: "SoundClash Count"
    }
];


Info.create(infos)
.then( () => {
    console.log(`Created ${infos.length} fake infos`);
})
.catch( (err) => {
    console.log(`Error connecting to mongo`, err);
});