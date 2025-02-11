import HttpStatus from "http-status";
import { UserServices } from "./user.service";
import { UserValidation } from "./user.validation";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const createUser = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createUserDB(password, studentData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
};
