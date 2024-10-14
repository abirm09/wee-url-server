import { Prisma } from "@prisma/client";
import { TErrorMessages } from "../types/response/genericErrorResponse";

const handlePrismaKnownError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  let errors: TErrorMessages[] = [];
  let message = "";
  const statusCode = 400;

  if (error.code === "P2025") {
    message = (error.meta?.cause as string) || "Record not found!";
    errors = [
      {
        path: "",
        message,
      },
    ];
  } else if (error.code === "P2003") {
    if (error.message.includes("delete()` invocation:")) {
      message = "Delete failed";
      errors = [
        {
          path: "",
          message,
        },
      ];
    }
  } else if (error.code === "P2002") {
    message = "Duplicate error";
    errors = [
      {
        path: "",
        message: `The ${(error?.meta?.target as string[])![0]} on ${error?.meta?.modelName} is already exist`,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handlePrismaKnownError;

//"//\nInvalid `prisma.semesterRegistration.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
