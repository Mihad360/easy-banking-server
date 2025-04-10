import HttpStatus from "http-status";
import { facultyServices } from "./faculty.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getFaculty = catchAsync(async (req, res) => {
  const result = await facultyServices.getFaculty(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Faculty retrieved succesfully",
    meta: result.meta,
    data: result.result,
  });
});

const getEachFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await facultyServices.getEachFaculty(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Faculty found succesfully",
    data: result,
  });
});

const updateEachFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await facultyServices.updateFaculty(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Faculty updated succesfully",
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await facultyServices.deleteEachFaculty(id);
  
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Faculty is deleted succesfully',
      data: result,
    });
  });

export const facultyControllers = {
  getFaculty,
  getEachFaculty,
  updateEachFaculty,
  deleteFaculty
};
