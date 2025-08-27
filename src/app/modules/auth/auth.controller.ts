import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpstatuscode from "http-status-codes";
import { AuthSerice } from "./auth.service";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthSerice.credentialLogin(req.body);
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "User Login successfully",
    data: loginInfo,
  });
});
export const AuthController = {
  credentialLogin,
};
