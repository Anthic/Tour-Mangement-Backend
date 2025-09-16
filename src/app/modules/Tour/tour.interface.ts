import { Types } from "mongoose";

export interface ITourType {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITour {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  image?: string[];
  description?: string;
  location?: string;
  costForm?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
