/* eslint-disable no-unused-vars */

import { Types } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}
export interface IAuthProvider {
  provider: "google" | "creditals"; // e.g., 'google', 'facebook', 'local'
  providerId: string;
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  picture?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  role: UserRole;
  auths: IAuthProvider[];

  booking?: Types.ObjectId[];
  guids?: Types.ObjectId[];
}
