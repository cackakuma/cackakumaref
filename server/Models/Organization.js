const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  orgName: {type: String, required: true},
  acronym: {type: String, required: true},
  logo: [{
    link: String,
    originalName: String
  }],
  description: {type: String, required: true},
  mission: {type: String, required: true},
  vision: {type: String, required: true},
  objective: {type: String}
  ,
  integrity: [{
    impact: String,
    details: String
  }]
});

module.exports = mongoose.model("Org", OrgSchema);