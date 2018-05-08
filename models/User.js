const mongoose = require('mongoose');
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
  avatar: { type: String },
  events: [
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
