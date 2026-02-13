import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { divisionService } from "./division.service";
import { sendResponse } from "../../../utils/sendResponse";
import httpstatuscode from "http-status-codes";
import cloudinary from "../../../config/cloudinary.config";
const createDivision = catchAsync(async (req: Request, res: Response) => {
  const thumbnail = req.file?.path;
  const divisionData = {
    ...req.body,
    thumbnail,
  };
  const createNewDivision = await divisionService.createDivision(divisionData);

  sendResponse(res, {
    statusCode: httpstatuscode.CREATED,
    success: true,
    message: "Division Created Successfully",
    data: createNewDivision,
  });
});

const getAllTheDivision = catchAsync(async (req: Request, res: Response) => {
  const getDivision = await divisionService.getAllDivisions(
    req.query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Division retrieved successfully",
    data: getDivision.data,
    meta: getDivision.meta,
  });
});
const getDivisionBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const getDivision = await divisionService.getDivisionBySlug(slug);
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Division retrieved successfully by slug",
    data: getDivision.data,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const thumbnail = req.file?.path;

  if (thumbnail) {
    const existingDivision = await divisionService.getDivisionById(id);
    if (existingDivision?.thumbnailPublicId) {
      await cloudinary.uploader.destroy(existingDivision.thumbnailPublicId);
    }
  }
  const updateData = {
    ...req.body,
    ...(req.file?.path && {
      thumbnail: req.file.path,
      thumbnailPublicId: req.file.filename,
    }),
  };
  const updateDivisionById = await divisionService.updateDivision(
    id,
    updateData
  );
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Division update successfully",
    data: updateDivisionById,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deleteDivisionById = await divisionService.deleteDivision(id);
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Division deleted successfully",
    data: deleteDivisionById,
  });
});

export const divisionController = {
  createDivision,
  getAllTheDivision,
  updateDivision,
  deleteDivision,
  getDivisionBySlug,
};
