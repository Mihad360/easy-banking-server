import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import SemesterRegistrationModel from "./semesterRegistration.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { SemesterRegistrationReadOnlyStatus } from "./semesterRegistraion.const";

const createSemesterRegistration = async (payload: TSemesterRegistration) => {
  const academicSemester = payload?.academicSemester;

  // check if there is any upcoming | ongoing semester is exist
  const isThereUpcomingOrOngoingSemester =
    await SemesterRegistrationModel.findOne({
      $or: [
        { status: SemesterRegistrationReadOnlyStatus.UPCOMING },
        { status: SemesterRegistrationReadOnlyStatus.ONGOING },
      ],
    });
  if (isThereUpcomingOrOngoingSemester) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `There is already an ${isThereUpcomingOrOngoingSemester.status} semester existed`,
    );
  }
  // check if id exist
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This academic semester not found",
    );
  }
  // check if semester is already registered
  const isSemesterRegistrationExists = await SemesterRegistrationModel.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This semester is already registered",
    );
  }

  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

const getSemesterRegistrations = async (query: Record<string, unknown>) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate("academicSemester"),
    query,
  )
    .filter()
    .sort()
    .pagination()
    .limitFields();
  const result = semesterRegistrationQuery.modelQuery;
  return result;
};

const getEachSemesterRegistration = async (id: string) => {
  const result =
    await SemesterRegistrationModel.findById(id).populate("academicSemester");
  return result;
};

const updateSemesterRegistration = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested registered semester is exist
  const isTheSemesterRegExist = await SemesterRegistrationModel.findById(id);
  if (!isTheSemesterRegExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The semester not found");
  }

  // if the requested semester registration ended , we will not update anything
  const currentSemesterRequestedStatus = isTheSemesterRegExist?.status;
  if (
    currentSemesterRequestedStatus === SemesterRegistrationReadOnlyStatus.ENDED
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterRequestedStatus}`,
    );
  }
  // checking the status updating methods
  const requestedStatus = payload?.status;
  if (
    currentSemesterRequestedStatus ===
      SemesterRegistrationReadOnlyStatus.UPCOMING &&
    requestedStatus === SemesterRegistrationReadOnlyStatus.ENDED
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You cannot directly update the ${currentSemesterRequestedStatus} to ${requestedStatus}`,
    );
  }
  if (
    currentSemesterRequestedStatus ===
      SemesterRegistrationReadOnlyStatus.ONGOING &&
    requestedStatus === SemesterRegistrationReadOnlyStatus.UPCOMING
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You cannot directly update the ${currentSemesterRequestedStatus} to ${requestedStatus}`,
    );
  }
  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );
  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegistration,
  getSemesterRegistrations,
  getEachSemesterRegistration,
  updateSemesterRegistration,
};
