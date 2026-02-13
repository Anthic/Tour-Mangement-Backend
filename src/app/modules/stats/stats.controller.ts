import httpStatusCode from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../../utils/sendResponse";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const [userStats, tourStats] = await Promise.all([
    StatsService.getUserStats(),
    StatsService.getTourStats(),
  ]);

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Dashboard stats retrieved",
    data: {
      users: userStats,
      tours: tourStats,
    },
  });
});

export const StatsController = {
  getDashboardStats,
};
