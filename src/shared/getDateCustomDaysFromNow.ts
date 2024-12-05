import httpStatus from "http-status";
import { ApiError } from "../errorHandlers";

export const getDateCustomDaysFromNow = (day: string) => {
  const match = day.match(/^(\d+)\s*d$/);

  const dayInNumber = match ? parseInt(match[1], 10) : 0;

  if (dayInNumber < 1)
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid date input");

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + dayInNumber);

  return currentDate;
};
