import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpstatuscode from "http-status-codes";
import { AuthSerice } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { clearAuthToken, setAuthToken } from "../../../utils/setAuthToken";
import { createUserToken } from "../../../utils/userToken";
import { configEnv } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthSerice.credentialLogin(req.body);

  setAuthToken(res, {
    accessToken: loginInfo.accessToken,
    refreshToken: loginInfo.refreshToken,
  });
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "User Login successfully",
    data: { user: loginInfo.user },
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token doesnt get", httpstatuscode.BAD_REQUEST);
  }
  const tokenInfo = await AuthSerice.getNewAccessToken(refreshToken as string);

  setAuthToken(res, {
    accessToken: tokenInfo.accessToken,
  });
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Token access successfully",
    data: null,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  clearAuthToken(res);
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

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthSerice.changePassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpstatuscode.OK,
    message: "Password Changed Successfully",
    data: null,
  });
});

const setPassword = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { password } = req.body;

  await AuthSerice.setPassword(decodedToken.userId, password);

  sendResponse(res, {
    success: true,
    statusCode: httpstatuscode.OK,
    message: "Password Changed Successfully",
    data: null,
  });
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  await AuthSerice.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: httpstatuscode.OK,
    message: "Email Sent Successfully",
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
  changePassword,
  setPassword,
  forgotPassword,
};
