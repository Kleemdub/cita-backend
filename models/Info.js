const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const infoSchema = new Schema({
  count: { type: Number },
  name: { type: String}
}, {
  timestamps: true
});

const Info = mongoose.model('Info', infoSchema);

module.exports = Info;
