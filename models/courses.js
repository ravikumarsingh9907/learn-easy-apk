const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    default: "Free",
  },
  description: {
    type: String,
    default: "Information Not Available",
  },
  url: {
    type: String,
    required: true,
  },
  prequisites: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
  },
  image: {
    type: String,
  },
});

const course = mongoose.model("Course", courseSchema);

module.exports = course;
