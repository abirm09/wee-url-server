import { Prisma, Url } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../../../app";
import { ApiError } from "../../../../errorHandlers";
import { TJWTPayload, TPaginationOption } from "../../../../types";
import { CacheManager, Pagination } from "../../../../utilities";
import { TUrlFilterRequest } from "./ur.types";
import { URLHelper } from "./url.helper";

const createIntoDB = async (url: Url, user: TJWTPayload) => {
  return prisma.$transaction(async (tx) => {
    await URLHelper.createNewUrl(url, user, tx);
  });
};

const getAllUserFromDB = async (
  user: TJWTPayload,
  options: TPaginationOption,
  filters: TUrlFilterRequest
) => {
  const { limit, skip, sortBy, sortOrder, page } =
    Pagination.calculate(options);
  const andCondition = [];

  andCondition.push({
    userId: user.userId,
  });

  if (Object.keys(filters)) {
    andCondition.push({
      AND: Object.keys(filters).map((key) => {
        if (key === "tags") {
          if (!Array.isArray(filters[key])) {
            filters[key] = [filters[key] as string];
          }
          return {
            tags: { hasSome: filters[key] },
          };
        }
        return {
          [key]: { equals: (filters as Record<string, unknown>)[key] },
        };
      }),
    });
  }

  const whereConditions: Prisma.UrlWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.url.findMany({
    where: whereConditions,
    select: {
      id: true,
      shortCode: true,
      fullUrl: true,
      tags: true,
      createdAt: true,
      _count: {
        select: {
          urlMetrics: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.url.count({
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
};

const getUniqueTagsCustomerFromDB = async (user: TJWTPayload) => {
  let uniqueTags: string[] | null = await CacheManager.getTagsCache(
    user.userId
  );

  if (!uniqueTags) {
    const result = await prisma.url.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        tags: true,
      },
    });

    uniqueTags = Array.from(new Set(result.flatMap((url) => url.tags)));

    await CacheManager.setTagsCache(user.userId, uniqueTags);
  }

  return {
    tags: uniqueTags,
  };
};

const getSingleUrlCustomerFromDB = async (user: TJWTPayload, id: string) => {
  const result = await prisma.url.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      shortCode: true,
      fullUrl: true,
      tags: true,
      createdAt: true,
      isActive: true,
      expiresAt: true,
      updatedAt: true,
      password: true,
      _count: {
        select: {
          urlMetrics: true,
        },
      },
    },
  });

  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "No URL found");

  if (result.password) result.password = "exist";

  return result;
};

export const URLService = {
  createIntoDB,
  getAllUserFromDB,
  getUniqueTagsCustomerFromDB,
  getSingleUrlCustomerFromDB,
};
