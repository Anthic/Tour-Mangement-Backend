import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import httpStatusCode from "http-status-codes";
import { verifyToken } from "../../utils/jwt";
import { configEnv } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(
          "You are not authorized to access this route",
          httpStatusCode.UNAUTHORIZED
        );
      }

      const varifiedToken = verifyToken(
        accessToken,
        configEnv.JWT_SECRET
      ) as JwtPayload;
      if (!varifiedToken) {
        throw new AppError(
          "You are not authorized to access this route",
          httpStatusCode.UNAUTHORIZED
        );
      }
      // authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
      if (!authRoles.includes(varifiedToken.role)) {
        throw new AppError(
          "You are not authorized to access this route",
          httpStatusCode.UNAUTHORIZED
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
