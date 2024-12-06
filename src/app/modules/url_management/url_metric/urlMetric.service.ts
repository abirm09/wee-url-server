import { prisma } from "../../../../app";
import { TJWTPayload, TPaginationOption } from "../../../../types";
import { Pagination } from "../../../../utilities";

const getFromDB = async (
  user: TJWTPayload,
  id: string,
  options: TPaginationOption
) => {
  const { limit, skip, sortBy, sortOrder, page } =
    Pagination.calculate(options);

  return prisma.$transaction(async (tx) => {
    const whereConditions = {
      id,
      url: {
        userId: user.userId,
      },
    };

    const result = await tx.urlMetrics.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await tx.urlMetrics.count({
      where: whereConditions,
    });

    return {
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
      data: result,
    };
  });
};

export const UrlMetricService = {
  getFromDB,
};
