import { Response } from "express";

export interface AuthToken {
  accessToken?: string;
  refreshToken?: string;
}


const accessTokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000, 
  path: "/",
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/", 
};

export const setAuthToken = (res: Response, tokenInfo: AuthToken) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, accessTokenOptions);
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, refreshTokenOptions);
  }
};

export const clearAuthToken = (res: Response) => {
 
  res.clearCookie("accessToken", {
    httpOnly: accessTokenOptions.httpOnly,
    secure: accessTokenOptions.secure,
    sameSite: accessTokenOptions.sameSite,
    path: accessTokenOptions.path,
  });
  
  res.clearCookie("refreshToken", {
    httpOnly: refreshTokenOptions.httpOnly,
    secure: refreshTokenOptions.secure,
    sameSite: refreshTokenOptions.sameSite,
    path: refreshTokenOptions.path,
  });
};