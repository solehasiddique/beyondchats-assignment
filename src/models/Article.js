const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  publishedDate: Date,
  url: String,
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);
