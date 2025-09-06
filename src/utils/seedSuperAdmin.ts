import { configEnv } from "./../config/env";
import { User } from "../app/modules/Users/user.model";
import {
  IAuthProvider,
  IUser,
  UserRole,
} from "../app/modules/Users/user.interface";
import bycripts from "bcryptjs";
export const seedSuperAdmin = async () => {
  try {
    const isSupperAdminExist = await User.findOne({
      email: configEnv.Supper_Admin_Email,
    });

    if (isSupperAdminExist) {
      console.log("supper admin already exist ");
      return;
    }
    console.log("tring to create supper admin");

    const hashedPassword = await bycripts.hash(
      configEnv.Password,
      Number(configEnv.BCRYPT_SALT_ROUNDS)
    );

    const authProvider: IAuthProvider = {
      provider: "creditals",
      providerId: configEnv.Supper_Admin_Email,
    };
    const payload: IUser = {
      name: "supper admin",
      email: configEnv.Supper_Admin_Email,
      role: UserRole.SUPER_ADMIN,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("supper admin created successful", superAdmin);
  } catch (error) {
    console.log(error);
  }
};
