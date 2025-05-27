import { model, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    customerId: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePhotoUrl: {
      type: String,
      default: "",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

customerSchema.virtual("fullName").get(function (next) {
  return `${this?.name?.firstName} ${this?.name?.lastName}`;
  next();
});

export const CustomerModel = model("Customer", customerSchema);
