const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  pics: [{
    link: String,
  },],
  description: {type: String, required: true},
  typper: {type: String, required: true},
  category: {type: String, required: true},
});


module.exports = mongoose.model("Post", postSchema);

