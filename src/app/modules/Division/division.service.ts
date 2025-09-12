import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.models";

const createDivision = async (payload: Partial<IDivision>) => {
  if (!payload.name) {
    throw new AppError("Division name is required", httpStatusCode.BAD_REQUEST);
  }
  if (!payload.slug && payload.name) {
    payload.slug = payload.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (payload.slug === "") {
    payload.slug = "division";
  }
  if (payload.name) {
    payload.name = payload.name.trim();
  }
  if (payload.slug) {
    payload.slug = payload.slug.toLowerCase().trim();
  }

  const isDivisionExist = await Division.findOne({
    $or: [{ name: payload.name }, { slug: payload.slug }],
  });
  if (isDivisionExist) {
    const conflictField =
      isDivisionExist.name === payload.name ? "name" : "slug";
    const conflictValue =
      conflictField === "name" ? payload.name : payload.slug;
    throw new AppError(
      `Division with this ${conflictField} '${conflictValue}' already exists`,
      httpStatusCode.CONFLICT
    );
  }
  const division = await Division.create(payload);

  
  return division;
};

const getAllDivisions = async () => {
  const division = await Division.find({});
  const countDivision = await Division.countDocuments();
  return {
    data: division,
    meta: {
      total: countDivision,
    },
  };
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

  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateDivision;
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};
export const divisionService = {
  createDivision,
  getAllDivisions,
  updateDivision,
  deleteDivision,
};
