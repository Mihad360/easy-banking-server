import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config";
import multer from "multer";

cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (
  path: string,
  imageName: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName,
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        if (!result) {
          reject(new Error("Cloudinary did not return a result"));
          return;
        }
        resolve(result);
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File deleted");
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
