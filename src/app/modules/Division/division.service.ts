/* eslint-disable no-console */
import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.models";
import { QueryBuilder } from "../../../utils/queryBuilder";
import { divisionSearchableFields } from "./division.constant";
import cloudinary from "../../../config/cloudinary.config";

const createDivision = async (payload: Partial<IDivision>) => {
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new AppError(
      "A division with this name already exists.",
      httpStatusCode.BAD_REQUEST
    );
  }
  const division = await Division.create(payload);

  return division;
};

const getAllDivisions = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);
  const divisionData = queryBuilder
    .search(divisionSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([
    divisionData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data: data,
    meta: {
      total: meta.total,
    },
  };
};
const getDivisionBySlug = async (slug: string) => {
  const division = await Division.findOne({ slug });

  return {
    data: division,
  };
};
const getDivisionById = async (id: string) => {
  const division = await Division.findById(id);
  if (!division) {
    throw new AppError("This division doesn't exist", httpStatusCode.NOT_FOUND);
  }
  return division;
};
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const exsitinDivision = await Division.findById(id);
  if (!exsitinDivision) {
    throw new AppError(
      "This division dosen't exsit",
      httpStatusCode.BAD_REQUEST
    );
  }
  const duplicateName = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateName) {
    throw new AppError("The name already exsit", httpStatusCode.BAD_REQUEST);
  }
  if (payload.thumbnail && exsitinDivision.thumbnailPublicId) {
    try {
      await cloudinary.uploader.destroy(exsitinDivision.thumbnailPublicId);
    } catch (error) {
      console.error("Failed to delete old thumbnail:", error);
    }
  }

  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateDivision;
};

const deleteDivision = async (id: string) => {
  const division = await getDivisionById(id);
  if (division.thumbnailPublicId) {
    try {
      await cloudinary.uploader.destroy(division.thumbnailPublicId);
    } catch (error) {
      console.error("Failed to delete thumbnail:", error);
    }
  }
  await Division.findByIdAndDelete(id);
  return null;
};
export const divisionService = {
  createDivision,
  getAllDivisions,
  updateDivision,
  deleteDivision,
  getDivisionBySlug,
  getDivisionById,
};
