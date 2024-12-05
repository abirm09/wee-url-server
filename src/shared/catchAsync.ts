import { NextFunction, Request, RequestHandler, Response } from "express";
import { DeleteImageFromCloudinary, Logger } from "../utilities";

export const catchAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const getFilenames = (): string[] => {
        if (req.file) return [req.file.filename];
        if (Array.isArray(req.files)) {
          // eslint-disable-next-line no-undef
          return (req.files as Express.Multer.File[]).map(
            (file) => file.filename
          );
        }
        return [];
      };

      const filesToDelete = getFilenames();
      if (filesToDelete.length > 0) {
        try {
          await DeleteImageFromCloudinary(filesToDelete);
        } catch (deleteError) {
          Logger.console.error(
            "Failed to delete images from Cloudinary:",
            deleteError
          );
        }
      }

      next(error);
    }
  };
