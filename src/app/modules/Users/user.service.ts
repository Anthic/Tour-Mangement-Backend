import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bycripts from "bcryptjs";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error(" User already exists");
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
export const UserService = {
  createUser,
  getAllUser,
};
