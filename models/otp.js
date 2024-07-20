import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiration: {
    type: Date,
    default: Date.now,
    get: (otpExpiration) => {
      otpExpiration.getTime();
    },
  },
});
