import httpstatuscode from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { IsActive, IUser } from "../app/modules/Users/user.interface";
import { configEnv } from "../config/env";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../app/modules/Users/user.model";
import AppError from "../app/errorHelpers/appError";

export const createUserToken = (user: Partial<IUser>) => {
  if (!user._id || !user.email || !user.role) {
    throw new AppError("Invalid user data for token creation", 400);
  }
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    configEnv.JWT_SECRET,
    configEnv.JWT_EXPIRES_IN
  );

  const refreshToken = generateToken(
    jwtPayload,
    configEnv.JWT_REFRESH_SECRET,
    configEnv.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    configEnv.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const userExists = await User.findOne({ email: verifyRefreshToken.email });

  if (!userExists) {
    throw new AppError("User does not exist", httpstatuscode.NOT_FOUND);
  }
  if (
    userExists.isActive === IsActive.BLOCKED ||
    userExists.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      `User is ${userExists.isActive}`,
      httpstatuscode.NOT_FOUND
    );
  }
 
  if (userExists.isDeleted === "true") {
    throw new AppError("User is deleted", httpstatuscode.NOT_FOUND);
  }

  const jwtPayload = {
    userId: userExists._id,
    email: userExists.email,
    role: userExists.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    configEnv.JWT_SECRET,
    configEnv.JWT_EXPIRES_IN
  );
  return {
    accessToken,
  };
};
