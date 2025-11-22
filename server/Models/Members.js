const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  logo: [{
    link: String,
    originalName: String
  }],
  bio: {type: String, required: true},
  typer: {type: String, required: true},
  email: {type: String, required: true},
  position: {type: String, required: true},
});

module.exports = mongoose.model("Member", memberSchema);