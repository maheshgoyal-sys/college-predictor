const mongoose = require('mongoose');

const maincollegeSchema = new mongoose.Schema({
  collegeName: String,
  branch: String,
  state: String,
  category: String,
  gender: String,
  quota: String,
  year: Number,
  openingRank: Number,
  closingRank: Number
});

module.exports = mongoose.model('mainCollege', maincollegeSchema);
