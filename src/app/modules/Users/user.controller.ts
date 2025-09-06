/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpstatuscode from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { verifyToken } from "../../../utils/jwt";
import { configEnv } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";

// catchAsync ta asche utils file theke

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
// throw new AppError("bad request", httpstatuscode.BAD_REQUEST);
//     const user = await UserService.createUser(req.body);
//     return res.status(httpstatuscode.CREATED).json({
//       message: "User created",
//       user,
//     });

//   } catch (error: any) {
//     next(error);
//   }
// };

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: httpstatuscode.CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  // const token = req.headers.authorization;
  // const verifiedToken = verifyToken(
  //   token as string,
  //   configEnv.JWT_SECRET
  // ) as JwtPayload;
  const verifiedToken = req.user;

  // Type guard to ensure verifiedToken exists
  if (!verifiedToken) {
    throw new AppError(
      "User authentication required",
      httpstatuscode.UNAUTHORIZED
    );
  }

  const payload = req.body;
  const user = await UserService.updateUser(userId, payload, verifiedToken);
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUser();
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const UserController = {
  createUser,
  getAllUser,
  updateUser,
};
