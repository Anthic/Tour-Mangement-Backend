import httpStatusCode from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../../utils/sendResponse";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const tour = req.body;
  const result = await TourService.createTour(tour);
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});
export const TourController = {
  createTour,
};
