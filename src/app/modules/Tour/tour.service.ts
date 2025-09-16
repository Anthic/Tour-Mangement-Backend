import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.models";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({
    title: payload.title,
  });
  if (existingTour) {
    throw new AppError(
      "A tour with this title already exists",
      httpStatusCode.BAD_REQUEST
    );
  }
  const tour = await Tour.create(payload);
  return tour;
};

const getAllTheTours = async () => {
  const tours = await Tour.find({});
  const totalTours = await Tour.countDocuments();
  return {
    tours,
    meta: {
      total: totalTours,
    },
  };
};
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isExistingTour = await Tour.findById(id);
  if (!isExistingTour) {
    throw new AppError("This Tour doesn't exsits", httpStatusCode.BAD_REQUEST);
  }
  const updateTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateTour;
};

const deletTour = async (id: string) => {
  await Tour.findByIdAndDelete(id);
  return null;
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
  const countTourType = await TourType.countDocuments();
  return {
    getTypes,
    meta: {
      countTourType,
    },
  };
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


const deletTourType = async(id : string)=>{
await TourType.findByIdAndDelete(id)
return null
}
export const TourService = {
  createTour,
  getAllTheTours,
  updateTour,
  deletTour,
};

export const TourTypeService = {
  createTourType,
  getTourType,
  updateTourType,
  deletTourType
};
