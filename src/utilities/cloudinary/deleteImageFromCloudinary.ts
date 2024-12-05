import { Cloudinary } from "../../config";
import { Logger } from "../logger/logger";

export const DeleteImageFromCloudinary = async (ids: string[]) => {
  try {
    await Cloudinary.api.delete_resources(ids);
  } catch (error) {
    Logger.console.info("Failed to delete image from cloudinary", error);
  }
};
