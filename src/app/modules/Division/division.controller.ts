import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { divisionService } from "./division.service";
import { sendResponse } from "../../../utils/sendResponse";
import httpstatuscode from "http-status-codes";
const createDivision = catchAsync(async (req: Request, res: Response) => {
  const createNewDivision = await divisionService.createDivision(req.body);

  sendResponse(res, {
    statusCode: httpstatuscode.CREATED,
    success: true,
    message: "Division Created Successfully",
    data: createNewDivision,
  });
});

const getAllTheDivision = catchAsync(async (req: Request, res: Response) => {
  const getDivision = await divisionService.getAllDivisions();
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Division retrieved successfully",
    data: getDivision.data,
    meta: getDivision.meta,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateDivisionById = await divisionService.updateDivision(id, req.body);
    sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Division update successfully",
    data: updateDivisionById
    
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deleteDivisionById = await divisionService.deleteDivision(id);
  sendResponse(res, {
    statusCode: httpstatuscode.OK,
    success: true,
    message: "Division deleted successfully",
    data: deleteDivisionById
  });
});

export const divisionController = {
  createDivision,
  getAllTheDivision,
  updateDivision,
  deleteDivision
};
