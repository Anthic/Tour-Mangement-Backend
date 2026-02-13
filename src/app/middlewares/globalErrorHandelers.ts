/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { configEnv } from "../../config/env";
import AppError from "../errorHelpers/appError";

interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  errorCode?: string;
  additionalData?: Record<string, unknown>;
  stack?: string;
}
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorCode: string | undefined;
  let additionalData: Record<string, unknown> | undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorCode = error.errorCode;
    additionalData = error.additionalData;
  }
  // Handle generic Error instances
  else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  const errorResponse: ErrorResponse = {
    success: false,
    message,
    statusCode,
    errorCode,
    additionalData,
    stack: configEnv.NODE_ENV === "development" ? error.stack : undefined,
  };
  res.status(statusCode).json(errorResponse);
};
