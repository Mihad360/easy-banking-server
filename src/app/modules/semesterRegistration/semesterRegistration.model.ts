import { Schema, model } from "mongoose";

const SemesterRegistrationSchema = new Schema(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: "AcademicSemester",
      required: true,
    },
    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "ENDED"],
      required: true,
      default: "UPCOMING"
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      required: true,
    },
    maxCredit: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const SemesterRegistrationModel = model(
  "SemesterRegistration",
  SemesterRegistrationSchema,
);

export default SemesterRegistrationModel;
