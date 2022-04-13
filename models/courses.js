const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: "Free",
    },
    level: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "Information Not Available",
    },
    prerequisites: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const course = mongoose.model("Course", courseSchema);

module.exports = course;
