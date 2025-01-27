import Joi from "joi";

const userNameValidationSchema = Joi.object({
  firstName: Joi.string().trim().max(20).required(),
  middleName: Joi.string().optional(),
  lastName: Joi.string().max(20).required(),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  motherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  contactNo: Joi.string().required(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameValidationSchema.required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required(),
  contactNumber: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ),
  profileImg: Joi.string().optional(),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianValidationSchema.required(),
  isActive: Joi.string().valid("active", "blocked").default("active"),
});

export default studentValidationSchema;