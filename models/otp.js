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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otpExpiration: {
    type: Date,
    default: Date.now,
    get: (otpExpiration) => otpExpiration.getTime(),
    set: (otpExpiration) => new Date(otpExpiration),
  },
});
export default mongoose.model("Otp", otpSchema);
