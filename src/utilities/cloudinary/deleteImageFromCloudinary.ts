import cloudinary from "../../config/cloudinary";
import { logger } from "../logger/logger";

const deleteImageFromCloudinary = async (ids: string[]) => {
  try {
    await cloudinary.api.delete_resources(ids);
  } catch (error) {
    logger.console.info("Failed to delete image from cloudinary", error);
  }
};

export default deleteImageFromCloudinary;
