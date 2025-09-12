import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.models";

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
  const basedslug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${basedslug}`;

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  payload.slug = slug;
  const tour = await Tour.create(payload)
  return tour
};
export const TourService = {
    createTour
}