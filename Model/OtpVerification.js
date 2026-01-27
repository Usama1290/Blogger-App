const mongoose = require("mongoose");
const { applyTimestamps } = require("./BlogUser");

//create schema

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    otpCode: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    ExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const otpVerification = mongoose.model("otpVerification", otpSchema);

module.exports = otpVerification;
