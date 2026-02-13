import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import bycripts from "bcryptjs";
import httpstatuscode from "http-status-codes";
import { configEnv } from "../../../config/env";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", httpstatuscode.BAD_REQUEST);
  }
  const hashedPassword = await bycripts.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "creditals",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /*
  no need to update email. email by default
  updated name phone password address
  password hashed korte hbe bycripts diye
  only admin and supper admin can change the ---- role,isDeleted etc.
  promoting to supper admin
  */
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError("User can not find", httpstatuscode.NOT_FOUND);
  }
  // if (ifUserExist.isDeleted || ifUserExist.isActive === IsActive.BLOCKED) {
  //   throw new AppError("You cannot updated that", httpstatuscode.FORBIDDEN);
  // }

  if (payload.role) {
    if (
      decodedToken.role === UserRole.USER ||
      decodedToken.role === UserRole.GUIDE
    ) {
      throw new AppError("You are not authorized", httpstatuscode.FORBIDDEN);
    }
    if (
      payload.role === UserRole.SUPER_ADMIN &&
      decodedToken.role === UserRole.ADMIN
    ) {
      throw new AppError("You are not authorize", httpstatuscode.FORBIDDEN);
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (
      decodedToken.role === UserRole.USER ||
      decodedToken.role === UserRole.GUIDE
    ) {
      throw new AppError("You are not authorize", httpstatuscode.FORBIDDEN);
    }
  }

  if (payload.password) {
    payload.password = await bycripts.hash(
      payload.password,
      configEnv.BCRYPT_SALT_ROUNDS
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUser = async () => {
  const users = await User.find({});
  const totalUser = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

const singleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};
export const UserService = {
  createUser,
  getAllUser,
  updateUser,
  getMe,
  singleUser,
};
