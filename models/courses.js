const mongoose = require("mongoose");
const deleteReview = require("./reviews");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    platform: {
      type: mongoose.Types.ObjectId,
      ref: 'Platform',
    },
    price: {
      type: String,
      default: "Free",
    },
    level: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "Information not available",
    },
    tags: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    image_id: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Categories"
    },
    language: {
        type: String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const course = mongoose.model("Course", courseSchema);

module.exports = course;
