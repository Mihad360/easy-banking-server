import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TOtp } from "./user.interface";
import { User } from "./user.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { sendOtpToEmail, verifyOtpAndCreateUser } from "../../utils/Otp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCustomer = async (file: any, payload: TOtp) => {
  const isUserExist = await User.findOne({ email: payload?.email });
  if (isUserExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The User already exists");
  }

  if (file) {
    const imageName = `${payload.name.firstName}-${payload.name.lastName}`;
    const { path } = file;
    const profileImg = await sendImageToCloudinary(path, imageName);
    payload.profilePhotoUrl = profileImg?.secure_url;
  }
  await sendOtpToEmail(payload);
};

const verifyOtp = async (payload: { email: string; otp: string }) => {
  if (!payload.email || !payload.otp) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Email or OTP required");
  }
  const result = await verifyOtpAndCreateUser(payload);
  return result;
};

const getUsers = async () => {
  const result = await User.find();
  return result;
};

const updateUserRole = async (id: string, payload: { role: string }) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  const result = await User.findByIdAndUpdate(
    id,
    {
      role: payload.role,
    },
    { new: true },
  );
  return result;
};

export const userServices = {
  createCustomer,
  getUsers,
  updateUserRole,
  verifyOtp,
};
