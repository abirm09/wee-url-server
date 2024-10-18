import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const params = {
  folder: "WeeURL",
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params,
});

const upload = multer({
  storage: storage,
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

export default upload;
