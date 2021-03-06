const mongoose = require('mongoose');
// const Event = require('./Event');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  nickname: { type : String },
  email: { type: String, required: true, unique: true },
  encryptedPassword: { type: String },
  role: { 
    type: String, 
    enum: ["normal", "admin"],
    default: "normal"
  },
  cup: { type: Number, default: 0 },
  game: {
    bullet: { type: Number },
    like: { type: Number },
    bouse: { type: Number }
  },
  avatar: { type: String },
  eventAdmin: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
  eventParticipant: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
}, {
  timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;
