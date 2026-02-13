/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUES {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  REFOUND = "REFOUND",
  FAILED = "FAILED",
}
export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  paymentGetWayData?: any;
  status: PAYMENT_STATUES;
}
