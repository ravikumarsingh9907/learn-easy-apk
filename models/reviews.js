const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "customers",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", reviewSchema);

module.exports = Reviews;
