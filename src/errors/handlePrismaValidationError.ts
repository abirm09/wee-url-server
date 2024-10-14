import { Prisma } from "@prisma/client";
import { TErrorResponse } from "../types/response/genericErrorResponse";

const handlePrismaValidationError = (
  error: Prisma.PrismaClientValidationError
): TErrorResponse => {
  const errors = [
    {
      path: "",
      message: error.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handlePrismaValidationError;
