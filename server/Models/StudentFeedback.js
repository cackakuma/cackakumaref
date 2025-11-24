const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
      studentName: String,
      studentEmail: String,
      feedbackMessage: String,
      rating: String,
});

module.exports = mongoose.model("StudentFeedback", feedSchema);