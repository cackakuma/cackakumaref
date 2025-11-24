const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {type: String, required: true},
  pics: [{ link: String, originalName: String }],
  description: {type: String, required: true},
  faci_name: String,
  faci_phone: String,
  faci_email: String,
  cohort_duration: {type: String, required: true},
  no_of_cohorts: {type: String, required: true},
  active: {type: Boolean, default: true},
  
  programBenefits: [{
      benefit: String
    }],
  
  communityImpact: [{
      impact: String,
      details: String
  }]
  
});

module.exports = mongoose.model("Program", programSchema);