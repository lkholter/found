var mongoose = require('mongoose');

var FoundObjectSchema = new mongoose.Schema({
  title: String,
  location: String,
  about: String
}, {
  timestamps: true
});

module.exports = mongoose.model('FoundObject', FoundObjectSchema);
