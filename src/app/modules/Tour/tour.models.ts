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
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
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


tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-tour`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;
  if (tour.title) {
    const baseSlug = tour.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-tour`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    tour.slug = slug;
  }
  this.setUpdate(tour);

  next();
});
export const Tour = model<ITour>("Tour", tourSchema);
