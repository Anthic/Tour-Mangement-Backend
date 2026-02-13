import httpStatusCode from "http-status-codes";
import crypto from "crypto";
import { User } from "../Users/user.model";
import AppError from "../../errorHelpers/appError";
import { redisClient } from "../../../config/redis.config";
import { sendEmail } from "../../../utils/sendEmail";

const OTP_EXPIRATION = 2 * 60;
const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User Not Found", httpStatusCode.NOT_FOUND);
  }
  if (user.isVerified) {
    throw new AppError("Email already verified", httpStatusCode.BAD_REQUEST, {
      errorCode: "ALREADY_VERIFIED",
    });
  }
  const otp = generateOtp();
  const rediskey = `otp:${email}`;

  await redisClient.set(rediskey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });
  await sendEmail({
    to: email,
    subject: "Verify Your Email - Tour Management",
    templateName: "otp",
    templateData: {
      name: name || user.name || "User",
      otp: otp,
      expirationMinutes: Math.floor(OTP_EXPIRATION / 60),
    },
  });
};
const verifyOTP = async (email: string, otp: string) => {
  // const user = await User.findOne({ email, isVerified: false })
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", httpStatusCode.NOT_FOUND);
  }

  if (user.isVerified) {
    throw new AppError("You are already verified", httpStatusCode.BAD_REQUEST);
  }

  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) {
    throw new AppError("Invalid OTP", httpStatusCode.BAD_REQUEST);
  }

  if (savedOtp !== otp) {
    throw new AppError("Invalid OTP", httpStatusCode.BAD_REQUEST);
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
