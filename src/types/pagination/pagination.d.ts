type TSortOrder = "asc" | "desc";

type TPaginationResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: TSortOrder;
};

type TPaginationOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: TSortOrder;
};

export type { TPaginationOption, TPaginationResult };
