import httpStatusCode from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { TourService, TourTypeService } from "./tour.service";
import { sendResponse } from "../../../utils/sendResponse";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const tour = req.body;
  

  const files = req.files as Express.Multer.File[];
  
  if (files && files.length > 0) {
 
    tour.image = files.map((file) => file.path);
  }
  const result = await TourService.createTour(tour);
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const getTours = await TourService.getAllTheTours(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tours retrieved successfully",
    data: getTours,
  });
});
const getSingleTourSlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const getTours = await TourService.getSingleTourSlug(slug);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tours retrieved successfully by slug",
    data: getTours,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const files = req.files as Express.Multer.File[];
  
  if (files && files.length > 0) {
   
    payload.image = files.map((file) => file.path);
  }
  const result = await TourService.updateTour(id, payload);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deletTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletSelectTour = await TourService.deletTour(id);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tour delet successfully",
    data: deletSelectTour,
  });
});

/**--------Tour Types-------**/

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const createTour = await TourTypeService.createTourType(payload);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tour type create successfully",
    data: createTour,
  });
});

const getTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourTypeService.getTourType();
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tour type get successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await TourTypeService.updateTourType(id, payload);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tour type update successfully",
    data: result,
  });
});
const deletTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourTypeService.deletTourType(id);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Tour type delete successfully",
    data: result,
  });
});
export const TourController = {
  createTour,
  getAllTours,
  updateTour,
  deletTour,
  getSingleTourSlug
};
export const TourTypeController = {
  createTourType,
  getTourType,
  updateTourType,
  deletTourType,
};
