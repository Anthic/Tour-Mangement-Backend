import jwt from "jsonwebtoken";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError";

import { User } from "../Users/user.model";
import httpstatuscode from "http-status-codes";
import bycripts from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../../utils/userToken";
import { IAuthProvider, IsActive, IUser } from "../Users/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { configEnv } from "../../../config/env";
import { sendEmail } from "../../../utils/sendEmail";
import { loginAttemptTracker } from "../../../utils/loginAttemptTracker";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;


    const isLocked = await loginAttemptTracker.isUserLocked(email as string);
  if (isLocked) {
    const attemptStatus = await loginAttemptTracker.getAttemptStatus(email as string);
    throw new AppError(
      "Account temporarily locked due to too many failed attempts",
      httpstatuscode.TOO_MANY_REQUESTS, 
      {
        errorCode: "ACCOUNT_LOCKED",
        remainingAttempts: attemptStatus.remainingAttempts,
        lockedUntil: attemptStatus.lockedUntil,
        requiresCaptcha: attemptStatus.requiresCaptcha,
      }
    );
  }
  const userExists = await User.findOne({ email }).select("+password");

    if (!userExists) {
 
    const attemptResult = await loginAttemptTracker.recordFailedAttempt(email as string);
    throw new AppError(
      "No account found with this email address",
      httpstatuscode.NOT_FOUND,
      {
        errorCode: "USER_NOT_FOUND",
        remainingAttempts: attemptResult.remainingAttempts,
        lockedUntil: attemptResult.lockedUntil,
        requiresCaptcha: attemptResult.requiresCaptcha,
      }
    );
  }

  const isPasswordMatched = await bycripts.compare(
    password as string,
    userExists.password as string
  );

  if (!isPasswordMatched) {
    
    const attemptResult = await loginAttemptTracker.recordFailedAttempt(email as string);
    throw new AppError(
      "Incorrect password. Please try again",
      httpstatuscode.UNAUTHORIZED,
      {
        errorCode: "INVALID_PASSWORD",
        remainingAttempts: attemptResult.remainingAttempts,
        lockedUntil: attemptResult.lockedUntil,
        requiresCaptcha: attemptResult.requiresCaptcha,
      }
    );
  }
  if (userExists.isActive === IsActive.INACTIVE) {
    throw new AppError(
      "Your account has been deactivated. Please contact support",
      httpstatuscode.FORBIDDEN,
      { errorCode: "ACCOUNT_DEACTIVATED" }
    );
  }
  if (!userExists.isVerified) {
    throw new AppError(
      "Please verify your email address to continue",
      httpstatuscode.FORBIDDEN,
      { 
        errorCode: "EMAIL_NOT_VERIFIED",
        email: email 
      }
    );
  }
  // Generate JWT Token
  // access token and refresh token are bascially from utilts folder userToken
  // ✅ SUCCESSFUL LOGIN - Clear all attempts
  await loginAttemptTracker.clearAttempts(email as string);
  const userToken = createUserToken(userExists);

  // const accesstoken = jwt.sign(
  //   jwtPayload,
  //   "your_jwt_secret_key_jeta_pore_change_korbo",
  //   {
  //     expiresIn: "1d",
  //   }
  // );
  // use the secret and expiresIn from env config

  //frontend backend

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = userExists.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

// token access
const getNewAccessToken = async (refreshToken: string) => {
  const createNewAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return createNewAccessToken;
  
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bycripts.compare(
    oldPassword,

    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(
      "Old password doesn't match",
      httpstatuscode.BAD_REQUEST
    );
  }

  user!.password = await bycripts.hash(
    newPassword,
    Number(configEnv.BCRYPT_SALT_ROUNDS)
  );

  user!.save();
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bycripts.compare(
    oldPassword,

    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(
      "Old Password does not match",
      httpstatuscode.UNAUTHORIZED
    );
  }

  user!.password = await bycripts.hash(
    newPassword,
    Number(configEnv.BCRYPT_SALT_ROUNDS)
  );

  user!.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", httpstatuscode.NOT_FOUND);
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      "You have already set you password. Now you can change the password from your profile password update",
      httpstatuscode.BAD_REQUEST
    );
  }

  const hashedPassword = await bycripts.hash(
    plainPassword,
    Number(configEnv.BCRYPT_SALT_ROUNDS)
  );

  const credentialProvider: IAuthProvider = {
    provider: "creditals",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;

  user.auths = auths;

  await user.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError("User does not exist", httpstatuscode.BAD_REQUEST);
  }
  if (!isUserExist.isVerified) {
    throw new AppError("User is not verified", httpstatuscode.BAD_REQUEST);
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      `User is ${isUserExist.isActive}`,
      httpstatuscode.BAD_REQUEST
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError("User is deleted", httpstatuscode.BAD_REQUEST);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, configEnv.JWT_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${configEnv.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });

  /**
   * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
   */
};
export const AuthSerice = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword,
};
