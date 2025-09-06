import AppError from "../../errorHelpers/appError";

import { User } from "../Users/user.model";
import httpstatuscode from "http-status-codes";
import bycripts from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../../utils/userToken";
import { IUser } from "../Users/user.interface";
import { JwtPayload } from "jsonwebtoken";
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
  // access token and refresh token are bascially from utilts folder userToken

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
  return {
    accessToken: createNewAccessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bycripts.compare(
    oldPassword,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(
      "Old password doesn't match",
      httpstatuscode.BAD_REQUEST
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.password = await bycripts.hash(
    newPassword,
    Number(configEnv.BCRYPT_SALT_ROUNDS)
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.save();
  
};
export const AuthSerice = {
  credentialLogin,
  getNewAccessToken,
  resetPassword
};
