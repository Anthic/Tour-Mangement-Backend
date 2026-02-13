import { Types } from "mongoose";

export enum BOOKING_STATUES {
  PANDING = "PANDING",
  CANCELLED = "CANCELLED",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}
export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  status: BOOKING_STATUES;
}
