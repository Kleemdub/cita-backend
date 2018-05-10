const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
    title: { type : String },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: [ { type: String } ],
    nbSelectas: { type: Number },
    selectas: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    nbRounds:  { type: Number },
    rounds: [
        {
            roundNumber: { type: Number },
            status: { 
                type: String, 
                enum: ["open", "ready", "displayed", "closed"],
                default: "open"
            },
            nbSelectas: { type: Number },
            duration : { type: Number },
            isFinal : { type: Boolean },
            selectas: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                }
            ],
            genres: { type: String },
            style: { type: String },
            sets: [
                {
                    selecta: {
                        type: Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    audio: { type: String },
                    title: { type: String },
                    description: { type: String },
                    tracklist: [ 
                        { 
                            type: Schema.Types.ObjectId,
                            ref: 'Tune'
                        } 
                    ],
                    score: { type: Number }
                }
            ]
        }
    ],
    status: {
        type: String, 
        enum: ["open", "pending", "ready", "displayed", "closed"],
        default: "open"
    }
}, {
    timestamps: true
});
  
  
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;