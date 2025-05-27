import { Schema, model } from "mongoose";
import { TManager } from "./manager.interface";

const ManagerSchema = new Schema<TManager>(
    {
        managerId: {
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
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        profilePhotoUrl: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const ManagerModel = model<TManager>("Manager", ManagerSchema);
