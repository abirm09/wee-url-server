import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../../config";
import {
  ApiError,
  handlePrismaKnownError,
  handlePrismaValidationError,
  handleZodError,
} from "../../errorHandlers";
import { TErrorMessages } from "../../types";
import { Logger } from "../../utilities";

/**
 * The `globalErrorHandler` function handles errors in a TypeScript application by logging the error in
 * development mode and sending a JSON response with error details.
 */
const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (env.env === "development")
    Logger.console.info(`❌ - Global error handler`, error);

  let statusCode = 500;
  let message = "Something went wrong! Please contact to the support";
  let errorMessages: TErrorMessages[] = [];

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaKnownError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: env.env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
