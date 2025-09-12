import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: {
      type: String,
      required: [true, "Tour type name is required"],
      unique: true,
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: { type: [String], default: [] },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    costForm: { type: Number, min: [0, "Cost cannot be negative"] },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },

    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number, min: [1, "At least 1 guest required"] },
    minAge: { type: Number, min: [0, "Age cannot be negative"] },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: [true, "Division is required"],
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: [true, "Tour type is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tour = model<ITour>("Tour", tourSchema);
