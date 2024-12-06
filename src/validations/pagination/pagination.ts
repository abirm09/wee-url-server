import { z } from "zod";

const query = {
  limit: z
    .string()
    .max(5, { message: "Limit must contain at most 5 characters" })
    .optional(),
  page: z
    .string()
    .max(2, { message: "Page must contain at most 2 characters" })
    .optional(),
  sortBy: z
    .string()
    .max(20, { message: "Sort by must contain at most 20 characters" })
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
};

export const PaginationValidation = {
  query,
};
