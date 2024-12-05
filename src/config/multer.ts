import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Cloudinary } from "./";

const userProfilePicParams = {
  folder: "WeeURL/userProfilePictures",
};

const storage = (params: { folder: string }) =>
  new CloudinaryStorage({
    cloudinary: Cloudinary,
    params,
  });

const userProfilePictures = multer({
  storage: storage(userProfilePicParams),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Accept only jpg, jpeg, and png formats
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(null, false); // Reject file without error
      return (req.fileValidationError =
        "Invalid file type. Only JPG, JPEG, and PNG are allowed!");
    }
  },
});

export const Upload = {
  userProfilePictures,
};
