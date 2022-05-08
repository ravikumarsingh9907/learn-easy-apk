const mongoose = require("mongoose");
const deleteReview = require("./reviews");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
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
    tags: {
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

courseSchema.post("findOneAndDelete", async function (docs) {
  if (docs) {
    await deleteReview.remove({
      _id: {
        $in: docs.reviews,
      },
    });
  }
});

const course = mongoose.model("Course", courseSchema);

module.exports = course;
