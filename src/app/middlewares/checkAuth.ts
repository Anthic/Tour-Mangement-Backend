import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import httpStatusCode from "http-status-codes";
import { verifyToken } from "../../utils/jwt";
import { configEnv } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/Users/user.model";
import { IsActive } from "../modules/Users/user.interface";
export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(
          "Access token required",
          httpStatusCode.UNAUTHORIZED
        );
      }

      const varifiedToken = verifyToken(
        accessToken,
        configEnv.JWT_SECRET
      ) as JwtPayload;
      // if (!varifiedToken) {
      //   throw new AppError(
      //     "You are not authorized to access this route",
      //     httpStatusCode.UNAUTHORIZED
      //   );
      // }
      // authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")

      // checking user exsist or not
      const userExists = await User.findOne({
        email: varifiedToken.email,
      });

      if (!userExists) {
        throw new AppError("User does not exist", httpStatusCode.NOT_FOUND);
      }
      if (
        userExists.isActive === IsActive.BLOCKED ||
        userExists.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          `User is ${userExists.isActive}`,
          httpStatusCode.NOT_FOUND
        );
      }

      if (userExists.isDeleted === "true") {
        throw new AppError("User is deleted", httpStatusCode.NOT_FOUND);
      }

      if (!authRoles.includes(varifiedToken.role)) {
        throw new AppError(
          "You are not authorized to access this route",
          httpStatusCode.UNAUTHORIZED
        );
      }
      req.user = varifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
};
