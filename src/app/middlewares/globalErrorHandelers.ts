/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { configEnv } from "../../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statuseCode = 500;
  let message = "something went wrong !!";

  if (error instanceof AppError) {
    statuseCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statuseCode = 500;
    message = error.message;
  }
  res.status(statuseCode).json({
    message,
    error: error.message || "An error occurred",
    errorStack: configEnv.NODE_ENV === "development" ? error.stack : null,
  });
};
