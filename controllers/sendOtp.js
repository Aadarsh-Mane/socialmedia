import otpSchema from "../models/otp.js";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myphoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = new twilio(accountSid, authToken);

export const sendOtp = async (req, res) => {
  try {
    const id = req.userId;
    console.log(id);
    const { phoneNumber } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const cDate = new Date();
    const myotp = new otpSchema({
      phoneNumber: phoneNumber,
      otp: otp,
      otpExpiration: new Date(cDate.getTime()),
      userId: id,
    });
    await myotp.save();
    // await otpSchema.findOneAndUpdate(
    //   { phoneNumber },
    //   { otp, otpExpiration: new Date(cDate.getTime()) },
    //   { upsert: true, new: true, setDefaultOnInsert: true }
    // );
    await twilioClient.messages.create({
      body: `your otp is:${otp} `,
      to: phoneNumber,
      from: myphoneNumber,
    });
    return res.status(200).json({
      sucess: true,
      msg: otp,
      messgae: "message send success",
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      msg: error.message,
    });
  }
};
