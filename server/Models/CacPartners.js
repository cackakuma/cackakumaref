const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  partnerName: {type: String, required: true},
  officialSite: {type: String, required: true},
  logo: [{ 
    link: String,
    originalName: String
  }],
  acronym: {type: String, required: true},
  partnershipDetails: {type: String, required: true}
});

module.exports = mongoose.model("Partner", partnerSchema);