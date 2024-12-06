import { TPaginationOption, TPaginationResult } from "../../types";

const calculate = (options: TPaginationOption): TPaginationResult => {
  const page = Number(options.page || "1");
  const limit =
    Number(options.limit || "10") > 99 ? 99 : Number(options.limit || "10");
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const Pagination = {
  calculate,
};
