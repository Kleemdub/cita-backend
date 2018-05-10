require('dotenv').config();

const mongoose = require("mongoose");

const Event = require("../models/Event");

mongoose.Promise = Promise;
mongoose
.connect(process.env.database_url, {useMongoClient: true})
.then(() => {
console.log('Connected to Mongo!')
}).catch(err => {
console.error('Error connecting to mongo', err)
});

const events = [
    {
        title: "Sound Clash #1",
        admin: "5af47829b1f4df36fcb52f7f",
        tags: [ "ska", "rocksteady", "boss", "roots" ],
        nbSelectas: 3,
        status: "displayed",
        selectas: [
            "5af47829b1f4df36fcb52f7f", 
            "5af47829b1f4df36fcb52f81", 
            "5af47829b1f4df36fcb52f80"
        ],
        nbRounds: 3,
        rounds: [
            {
                roundNumber: 1,
                status: "open",
                nbSelectas: 3,
                duration: 20,
                isFinal: false,
                selectas: [
                    "5af47829b1f4df36fcb52f7f", 
                    "5af47829b1f4df36fcb52f81", 
                    "5af47829b1f4df36fcb52f80"
                ],
                genres: "ska",
                style: "Vocal",
                sets: [
                    {
                        selecta: "5af47829b1f4df36fcb52f7f",
                        audio: "fake link",
                        title: "User 1 Set 1",
                        description: "Blah Blah Blah",
                        tracklist: [
                            "5af15c1ea69cf9386409bf88",
                            "5af15c1ea69cf9386409bf89",
                            "5af15c1ea69cf9386409bf8a",
                            "5af15c1ea69cf9386409bf8b"
                        ],
                        score: 0
                    },
                    {
                        selecta: "5af47829b1f4df36fcb52f81",
                        audio: "fake link",
                        title: "User 2 Set 1",
                        description: "Blah Blah Blah",
                        tracklist: [
                            "5af15c1ea69cf9386409bf88",
                            "5af15c1ea69cf9386409bf89",
                            "5af15c1ea69cf9386409bf8a",
                            "5af15c1ea69cf9386409bf8b"
                        ],
                        score: 0
                    },
                    {
                        selecta: "5af47829b1f4df36fcb52f80",
                        audio: "fake link",
                        title: "User 3 Set 1",
                        description: "Blah Blah Blah",
                        tracklist: [
                            "5af15c1ea69cf9386409bf88",
                            "5af15c1ea69cf9386409bf89",
                            "5af15c1ea69cf9386409bf8a",
                            "5af15c1ea69cf9386409bf8b"
                        ],
                        score: 0
                    }
                ]
            },
            {
                roundNumber: 2,
                status: "open",
                nbSelectas: 3,
                duration: 20,
                isFinal: false,
                selectas: [
                    "5af47829b1f4df36fcb52f7f", 
                    "5af47829b1f4df36fcb52f81", 
                    "5af47829b1f4df36fcb52f80"
                ],
                genres: "boss",
                style: "Instrumental",
                sets: [
                    {
                        selecta: "5af47829b1f4df36fcb52f7f",
                        audio: "fake link",
                        title: "User 1 Set 2",
                        description: "Blah Blah Blah",
                        tracklist: [
                            "5af15c1ea69cf9386409bf88",
                            "5af15c1ea69cf9386409bf89",
                            "5af15c1ea69cf9386409bf8a",
                            "5af15c1ea69cf9386409bf8b"
                        ],
                        score: 0
                    },
                    {
                        selecta: "5af47829b1f4df36fcb52f81",
                        audio: "fake link",
                        title: "User 2 Set 2",
                        description: "Blah Blah Blah",
                        tracklist: [
                            "5af15c1ea69cf9386409bf88",
                            "5af15c1ea69cf9386409bf89",
                            "5af15c1ea69cf9386409bf8a",
                            "5af15c1ea69cf9386409bf8b"
                        ],
                        score: 0
                    },
                    {
                        selecta: "5af47829b1f4df36fcb52f80",
                        audio: "fake link",
                        title: "User 3 Set 2",
                        description: "Blah Blah Blah",
                        tracklist: [
                            "5af15c1ea69cf9386409bf88",
                            "5af15c1ea69cf9386409bf89",
                            "5af15c1ea69cf9386409bf8a",
                            "5af15c1ea69cf9386409bf8b"
                        ],
                        score: 0
                    }
                ]
            },
            {
                roundNumber: 3,
                status: "open",
                nbSelectas: 2,
                duration: 30,
                isFinal: true,
                selectas: [],
                genres: "roots",
                style: "Instrumental",
                sets: []
            }
        ]
    },
];


Event.create(events)
.then( () => {
    console.log(`Created ${events.length} fake events`);
})
.catch( (err) => {
    console.log(`Error connecting to mongo`, err);
});