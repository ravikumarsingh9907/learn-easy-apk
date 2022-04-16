const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    query: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const contact = new mongoose.model("contact", contactSchema);

module.exports = contact;
