const mongoose = require('mongoose');
const testSchema = new mongoose.Schema({
      fullName: String,
      email: String,
      message: String
});

module.exports = mongoose.model("Testimony", testSchema);
