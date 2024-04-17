const mongoose = require("mongoose");
const string_decoder = require("string_decoder");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: String,
      default: false,
    },
    tokens: [{
        token: {
            type: String,
        }
    }],
  },
  {
    timestamps: true,
  }
);

const customers = new mongoose.model("User", userSchema);

module.exports = customers;
