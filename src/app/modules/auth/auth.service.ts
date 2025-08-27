import AppError from "../../errorHelpers/appError";
import { IUser } from "../Users/user.interface";
import { User } from "../Users/user.model";
import httpstatuscode from "http-status-codes";
import bycripts from "bcryptjs";

import { generateToken } from "../../../utils/jwt";
import { configEnv } from "../../../config/env";
const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists) {
    throw new AppError("User does not exist", httpstatuscode.NOT_FOUND);
  }

  const isPasswordMatched = await bycripts.compare(
    password as string,
    userExists.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError("Incorrect Password", httpstatuscode.BAD_REQUEST);
  }

  // Generate JWT Token

  const jwtPayload = {
    userId: userExists._id,
    email: userExists.email,
    role: userExists.role,
  };
  // const accesstoken = jwt.sign(
  //   jwtPayload,
  //   "your_jwt_secret_key_jeta_pore_change_korbo",
  //   {
  //     expiresIn: "1d",
  //   }
  // );
  // use the secret and expiresIn from env config
  const accessToken = generateToken(
    jwtPayload,
    configEnv.JWT_SECRET,
    configEnv.JWT_EXPIRES_IN
  );
  return {
    accessToken,
  };
};
export const AuthSerice = {
  credentialLogin,
};
