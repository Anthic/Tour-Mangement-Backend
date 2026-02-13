import { Tour } from "../Tour/tour.models";
import { User } from "../Users/user.model";

// compute date boundaries correctly
const now = new Date();
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({ isActive: "ACTIVE" });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: "INACTIVE",
  });
  const totalBlockedUsersPromise = User.countDocuments({ isActive: "BLOCKED" });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  };
};

const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();

  const totalTourByTourTypePromise = Tour.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$type.name", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const avgTourCostPromise = Tour.aggregate([
    { $match: { costForm: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: null,
        minCost: { $min: "$costForm" },
        maxCost: { $max: "$costForm" },
        avgCost: { $avg: "$costForm" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    { $unwind: { path: "$division", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$division.name", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const upcomingToursPromise = Tour.find({ startDate: { $gte: now } })
    .sort({ startDate: 1 })
    .limit(20);

  const popularLocationsPromise = Tour.aggregate([
    { $match: { location: { $exists: true, $ne: null } } },
    { $group: { _id: "$location", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const [
    totalTour,
    totalTourByTourType,
    avgTourCostArr,
    totalTourByDivision,
    upcomingTours,
    popularLocations,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    upcomingToursPromise,
    popularLocationsPromise,
  ]);

  const priceStats =
    avgTourCostArr && avgTourCostArr[0]
      ? avgTourCostArr[0]
      : { minCost: null, maxCost: null, avgCost: null };

  return {
    totalTour,
    totalTourByTourType,
    priceStats,
    totalTourByDivision,
    upcomingTours,
    popularLocations,
  };
};

export const StatsService = {
  getUserStats,
  getTourStats,
};
