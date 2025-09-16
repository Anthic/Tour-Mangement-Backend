import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.models";

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
