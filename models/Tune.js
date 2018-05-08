const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const tuneSchema = new Schema({
  artist: { type: String },
  title: { type: String },
  format: { type: String },
  label: { type: String },
  discogs: { type: String }
}, {
  timestamps: true
});


const Tune = mongoose.model('Tune', tuneSchema);

module.exports = Tune;
