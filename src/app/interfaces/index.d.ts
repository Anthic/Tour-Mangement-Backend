import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
export interface ILoginAttemptInfo {
  remainingAttempts: number;
  lockedUntil?: Date;
  requiresCaptcha: boolean;
}
export interface IAuthErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  remainingAttempts?: number;
  lockedUntil?: Date;
  requiresCaptcha?: boolean;
}