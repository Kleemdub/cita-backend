require('dotenv').config();

const mongoose = require("mongoose");

const Tune = require("../models/Tune");

mongoose.Promise = Promise;
mongoose
.connect(process.env.database_url, {useMongoClient: true})
.then(() => {
console.log('Connected to Mongo!')
}).catch(err => {
console.error('Error connecting to mongo', err)
});

const tunes = [
    {
        artist: 'Freddie McKay',
        title: 'You cup is full',
        format: '7',
        label: 'Sun Power',
        discogs: ''
    },
    {
        artist: 'Hippy Boys',
        title: 'Nigeria',
        format: '7',
        label: 'Gay Feet',
        discogs: ''
    },
    {
        artist: 'Abyssinians',
        title: 'Poor Jason Whyte',
        format: '7',
        label: 'Clinch',
        discogs: ''
    },
    {
        artist: 'Bonnie Gayle',
        title: 'I cant change my skin',
        format: '7',
        label: 'Black World',
        discogs: ''
    },
    {
        artist: 'Jackie Paris',
        title: 'Sinner man',
        format: '12',
        label: 'Techniques',
        discogs: ''
    },
    {
        artist: 'Ophelia',
        title: 'I man suffering',
        format: 'LP',
        label: 'Blah',
        discogs: ''
    },
    {
        artist: 'Larry Marshall',
        title: "I've got to make it",
        format: '7',
        label: 'Banana',
        discogs: ''
    },
    {
        artist: 'Keith Wilson',
        title: 'God i god i say',
        format: '7',
        label: 'Studio One',
        discogs: ''
    },
    {
        artist: 'Anthony Chambers',
        title: 'Jah Foundation',
        format: '7',
        label: 'High Times',
        discogs: ''
    },
    {
        artist: 'Carltons and the Shoes',
        title: 'Better days',
        format: '12',
        label: 'DEB',
        discogs: ''
    }
];




Tune.create(tunes)
.then( () => {
    console.log(`Created ${tunes.length} fake tunes`);
})
.catch( (err) => {
    console.log(`Error connecting to mongo`, err);
});