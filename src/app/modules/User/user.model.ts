import { model, Schema } from "mongoose";

const userNameSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const userSchema = new Schema(
  {
    name: userNameSchema,
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.virtual("fullName").get(function (next) {
  return `${this.name?.firstName} ${this.name?.lastName}`;
  next();
});

export const UserModel = model("User", userSchema);
