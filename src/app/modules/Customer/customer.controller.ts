import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { customerServices } from "./customer.service";

const getCustomers = catchAsync(async (req, res) => {
  const result = await customerServices.getCustomers();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Customers retrieved succesfully",
    data: result,
  });
});

const getEachCustomer = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await customerServices.getEachCustomer(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Customer retrieved succesfully",
    data: result,
  });
});

const updateCustomer = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await customerServices.updateCustomer(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Customer updated succesfully",
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await customerServices.deleteCustomer(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Customer deleted succesfully",
    data: result,
  });
});

export const customerControllers = {
  getCustomers,
  getEachCustomer,
  updateCustomer,
  deleteCustomer,
};
