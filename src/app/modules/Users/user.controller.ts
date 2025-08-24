/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpstatuscode from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

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

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const users = await UserService.getAllUser();
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

export const UserController = {
  createUser,
  getAllUser,
};
