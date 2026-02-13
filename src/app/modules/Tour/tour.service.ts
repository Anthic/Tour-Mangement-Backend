import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.models";
import { Division } from "../Division/division.models";
import { QueryBuilder } from "../../../utils/queryBuilder";
import {
  deleteMultipleImages,
  extractPublicId,
} from "../../../utils/cloudinaryHelper";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({
    title: payload.title,
  });
  if (existingTour) {
    throw new AppError(
      "A tour with this title already exists",
      httpStatusCode.CONFLICT
    );
  }
  const divisionExists = await Division.findById(payload.division);
  if (!divisionExists) {
    throw new AppError("Division not found", httpStatusCode.NOT_FOUND);
  }
  const tourTypeExists = await TourType.findById(payload.tourType);
  if (!tourTypeExists) {
    throw new AppError("Tour type not found", httpStatusCode.NOT_FOUND);
  }
  const tour = await Tour.create(payload);
  return tour;
};

const getAllTheTours = async (query: Record<string, unknown>) => {
  // Define searchable fields for tours
  const searchableFields = ["title", "description", "location"];

  // Build the query using the enhanced QueryBuilder
  const tourQuery = new QueryBuilder(Tour.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .select()
    .populate(["division", "tourType"]);

  // Execute the query
  const tours = await tourQuery.execute();

  // Get total count for pagination metadata - using a simpler approach
  const filterQuery = new QueryBuilder(Tour.find(), query)
    .search(searchableFields)
    .filter();
  const filteredTours = await filterQuery.execute();
  const total = filteredTours.length;

  // Generate pagination metadata
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const meta = QueryBuilder.getPaginationMeta(total, page, limit);

  return {
    success: true,
    message: "Tours retrieved successfully",
    data: tours,
    meta,
  };
};

const getSingleTourSlug = async (slug: string) => {
  const getTour = await Tour.findOne({ slug });
  return {
    success: true,
    message: "Tours retrieved successfully by slug",
    data: getTour,
  };
};
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isExistingTour = await Tour.findById(id);

  if (!isExistingTour) {
    throw new AppError("This Tour doesn't exsits", httpStatusCode.BAD_REQUEST);
  }
  if (payload.title !== undefined && payload.title.trim().length === 0) {
    throw new AppError(
      "Tour type name cannot be empty",
      httpStatusCode.BAD_REQUEST
    );
  }
  if (
    payload.image &&
    isExistingTour.image &&
    isExistingTour.image.length > 0
  ) {
    const publicIds = isExistingTour.image.map((url) => extractPublicId(url));
    await deleteMultipleImages(publicIds);
  }

  if (payload.division) {
    const divisionExists = await Division.findById(payload.division);
    if (!divisionExists) {
      throw new AppError("Division not found", httpStatusCode.NOT_FOUND);
    }
  }
  if (payload.tourType) {
    const tourTypeExists = await TourType.findById(payload.tourType);
    if (!tourTypeExists) {
      throw new AppError("Tour type not found", httpStatusCode.NOT_FOUND);
    }
  }
    if (payload.title && payload.title !== isExistingTour.title) {
    const duplicate = await TourType.findOne({ 
      name: payload.title.trim(),
      _id: { $ne: id }  
    });
    if (duplicate) {
      throw new AppError(
        "A tour type with this name already exists",
        httpStatusCode.CONFLICT
      );
    }
  }
  const updateTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateTour;
};

const deletTour = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new AppError("Tour not found", httpStatusCode.NOT_FOUND);
  }
  if (tour.image && tour.image.length > 0) {
    const publicIds = tour.image.map((url) => extractPublicId(url));
    await deleteMultipleImages(publicIds);
  }
  await Tour.findByIdAndDelete(id);
  return { message: "Tour deleted successfully" };
};

/**---------Types of Tour------------**/

const createTourType = async (payload: ITourType) => {
  const isExsitingTourType = await TourType.findOne({ name: payload.name });

  if (isExsitingTourType) {
    throw new AppError(
      "This type of tour already exsit",
      httpStatusCode.BAD_REQUEST
    );
  }
  return await TourType.create(payload);
};
const getTourType = async () => {
  const getTypes = await TourType.find({});
  return getTypes; // ✅ Direct array return - Controller will handle wrapper
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const isTourTypeExsit = await TourType.findById(id);
  if (!isTourTypeExsit) {
    throw new AppError("This tour does't exsit", httpStatusCode.BAD_REQUEST);
  }
  const updateType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateType;
};

const deletTourType = async (id: string) => {
  await TourType.findByIdAndDelete(id);
  return null;
};
export const TourService = {
  createTour,
  getAllTheTours,
  updateTour,
  deletTour,
  getSingleTourSlug,
};

export const TourTypeService = {
  createTourType,
  getTourType,
  updateTourType,
  deletTourType,
};
