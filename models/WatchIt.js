const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const watchSchema = new Schema({
    type: { 
        type: String, 
        enum: ["winClash", "winRound"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    },
    roundNumber: { type: Number },
    message: { type: String }
}, {
  timestamps: true
});

  
const Watchit = mongoose.model('Watchit', watchSchema);

module.exports = Watchit;
