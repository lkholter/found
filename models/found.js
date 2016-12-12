var mongoose = require('mongoose');

var FoundObjectSchema = new mongoose.Schema({
  title: String,
  location: String,
  about: String
}, {
  timestamps: true
});

function date2String(date) {
  var options = {
    weekday: 'long', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

FoundObjectSchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

FoundObjectSchema.methods.getUpdatedAt = function() {
  return date2String(this.updatedAt);
};

module.exports = mongoose.model('FoundObject', FoundObjectSchema);
