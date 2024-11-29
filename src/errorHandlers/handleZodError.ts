import { ZodError, ZodIssue } from "zod";
import { TErrorMessages, TErrorResponse } from "../types";

const handleZodError = (error: ZodError): TErrorResponse => {
  const errors: TErrorMessages[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleZodError;
