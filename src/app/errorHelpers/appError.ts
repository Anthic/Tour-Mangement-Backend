interface IAdditionalErrorInfo {
  errorCode?: string;
  email?: string;
  userId?: string;
  field?: string;
  value?: string | number;
  remainingAttempts?: number;
  lockedUntil?: Date;
  requiresCaptcha?: boolean;
  [key: string]: unknown;
}

class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode?: string;
  public readonly additionalData?: Readonly<Record<string, unknown>>;

  constructor(
    message: string,
    statusCode: number,
    additionalInfo?: IAdditionalErrorInfo
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorCode = additionalInfo?.errorCode;

    // Store additional data excluding errorCode
    if (additionalInfo) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { errorCode, ...rest } = additionalInfo;
      this.additionalData =
        Object.keys(rest).length > 0 ? Object.freeze(rest) : undefined;
    }

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      additionalData: this.additionalData,
      isOperational: this.isOperational,
    };
  }
}

export default AppError;
export type { IAdditionalErrorInfo };
