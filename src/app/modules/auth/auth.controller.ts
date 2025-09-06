import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpstatuscode from "http-status-codes";
import { AuthSerice } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setAuthToken } from "../../../utils/setAuthToken";
import { createUserToken } from "../../../utils/userToken";
import { configEnv } from "../../../config/env";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthSerice.credentialLogin(req.body);
  // res.cookie("accessToken", loginInfo.accessToken, {
  //   httpOnly: true,
  //   secure: false,
  // });
  // res.cookie("refreshToken", loginInfo.refreshToken, {
  //   httpOnly: true,
  //   secure: false,
  // });
  // from the setAuthToken part

  setAuthToken(res, loginInfo);
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "User Login successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token doesnt get", httpstatuscode.BAD_REQUEST);
  }
  const tokenInfo = await AuthSerice.getNewAccessToken(refreshToken as string);
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Token access successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "User logout successfully",
    data: null,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  // Type guard to ensure decodedToken exists
  if (!decodedToken) {
    throw new AppError(
      "User authentication required",
      httpstatuscode.UNAUTHORIZED
    );
  }

  await AuthSerice.resetPassword(oldPassword, newPassword, decodedToken);

  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});

const googleCallbackController = catchAsync(
  async (req: Request, res: Response) => {
    //redirect code
    let redirect = req.query.state ? (req.query.state as string) : "";
    if (redirect.startsWith("/")) {
      redirect = redirect.slice(1);
    }
    const user = req.user;
    console.log(user);
    if (!user) {
      throw new AppError("User not found", httpstatuscode.BAD_REQUEST);
    }
    const tokenInfo = createUserToken(user);
    setAuthToken(res, tokenInfo);
    // sendResponse(res, {
    //   statusCode: httpstatuscode.OK,
    //   success: true,
    //   message: "Google login  successfully",
    //   data: null,
    // });
    res.redirect(`${configEnv.FRONTEND_URL}/${redirect}`);
  }
);

export const AuthController = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};
