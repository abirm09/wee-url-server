import { SubscriptionPlan } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../../../app";
import { ApiError } from "../../../../errorHandlers";
import { TJWTPayload, TPaginationOption } from "../../../../types";
import { CacheManager, Pagination } from "../../../../utilities";
import {
  TUrlClickCountFilterableFields,
  TUrlMetricBreakdownQuery,
  TUrlMetricFilterableField,
} from "./urlMetric.types";

const getFromDB = async (
  user: TJWTPayload,
  id: string,
  options: TPaginationOption,
  filters: TUrlMetricFilterableField
) => {
  const { limit, skip, sortBy, sortOrder, page } =
    Pagination.calculate(options);

  return prisma.$transaction(async (tx) => {
    let userProfile = await CacheManager.getUserProfileCache(user.userId);
    if (!userProfile) {
      userProfile = await tx.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          fullName: true,
          userId: true,
          email: true,
          isEmailVerified: true,
          needsPasswordChange: true,
          role: true,
          status: true,
          subscriptions: {
            where: {
              isActive: true,
            },
            select: {
              plan: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
          profile: {
            select: {
              picture: true,
            },
          },
        },
      });

      if (userProfile)
        await CacheManager.setUserProfileCache(user.userId, userProfile);
    }
    const userSubscriptionType = userProfile?.subscriptions[0]?.plan?.type;
    let userSubscriptionPlan: SubscriptionPlan | null =
      await CacheManager.getSubscriptionPlanCache(userSubscriptionType);

    if (!userSubscriptionPlan) {
      userSubscriptionPlan = await tx.subscriptionPlan.findUnique({
        where: { type: userSubscriptionType },
      });

      if (userSubscriptionPlan)
        await CacheManager.setSubscriptionPlanCache(
          userSubscriptionType,
          userSubscriptionPlan
        );
    }
    if (userSubscriptionPlan?.analyticsAccess === false)
      throw new ApiError(
        httpStatus.PAYMENT_REQUIRED,
        `Analytics is not available for ${userSubscriptionType} user`
      );

    const andConditions: Record<string, unknown>[] = [
      {
        url: {
          id,
          userId: user.userId,
        },
      },
    ];

    if (filters?.accessedDeviceType) {
      andConditions.push({ accessedDeviceType: filters.accessedDeviceType });
    }

    if (filters?.accessedOnFrom && filters?.accessedOnTo) {
      andConditions.push({
        accessedOn: {
          gte: new Date(filters.accessedOnFrom),
          lte: new Date(filters.accessedOnTo),
        },
      });
    } else if (filters?.accessedOnFrom) {
      andConditions.push({
        accessedOn: { gte: new Date(filters.accessedOnFrom) },
      });
    } else if (filters?.accessedOnTo) {
      andConditions.push({
        accessedOn: { lte: new Date(filters.accessedOnTo) },
      });
    }

    const result = await tx.urlMetrics.findMany({
      where: {
        AND: andConditions,
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await tx.urlMetrics.count({
      where: { AND: andConditions },
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

const getUrlClicksCountCustomersFromDB = async (
  user: TJWTPayload,
  urlId: string,
  filters: TUrlClickCountFilterableFields
) => {
  const isValidUser = await prisma.url.findUnique({
    where: { id: urlId, userId: user.userId },
  });

  if (!isValidUser) throw new ApiError(httpStatus.BAD_REQUEST, "Url not found");

  const andCondition: Record<string, unknown>[] = [
    {
      urlId,
    },
  ];

  if (filters?.accessedDeviceType) {
    andCondition.push({ accessedDeviceType: filters?.accessedDeviceType });
  }

  if (filters?.accessedFromCountry) {
    andCondition.push({ accessedFromCountry: filters?.accessedFromCountry });
  }

  if (filters?.from && filters?.to) {
    andCondition.push({
      createdAt: {
        gte: new Date(filters.from),
        lte: new Date(filters.to),
      },
    });
  } else if (filters?.from) {
    andCondition.push({
      createdAt: {
        gte: new Date(filters.from),
      },
    });
  } else if (filters?.to) {
    andCondition.push({
      createdAt: {
        lte: new Date(filters.to),
      },
    });
  }

  const result = await prisma.urlMetrics.count({
    where: { AND: andCondition },
  });

  return { count: result };
};

const getUrlClicksStatFromDB = async (user: TJWTPayload, urlId: string) => {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayCount, monthCount, totalCount] = await prisma.$transaction([
    prisma.urlMetrics.count({
      where: {
        url: { userId: user.userId, id: urlId },
        accessedOn: {
          gte: startOfToday,
        },
      },
    }),
    prisma.urlMetrics.count({
      where: {
        url: { userId: user.userId, id: urlId },
        accessedOn: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.urlMetrics.count({
      where: {
        url: { userId: user.userId, id: urlId },
      },
    }),
  ]);

  return {
    today: todayCount,
    thisMonth: monthCount,
    total: totalCount,
  };
};

const getUrlStatsBreakdownFromDB = async (
  user: TJWTPayload,
  urlId: string,
  filter: TUrlMetricBreakdownQuery
) => {
  const { filterType, endDate, startDate } = filter || {};

  const startDateUtc = startDate ? new Date(startDate) : new Date(0);

  const today = new Date();
  const endDateUtc = endDate
    ? new Date(endDate)
    : new Date(today.setHours(23, 59, 59, 999));

  let results;

  if (filterType === "daily") {
    results = await prisma.$queryRaw<{ count: number; date: Date }[]>`SELECT
      COUNT(*) AS count,
      DATE_TRUNC('day', "accessedOn") AS date
    FROM "url_metrics"
    WHERE "urlId" = ${urlId}
      AND "accessedOn" BETWEEN ${startDateUtc} AND ${endDateUtc}
    GROUP BY DATE_TRUNC('day', "accessedOn")
    ORDER BY date DESC;`;
  } else if (filterType === "monthly") {
    results = await prisma.$queryRaw<{ count: number; date: Date }[]>`SELECT
      COUNT(*) AS count,
      DATE_TRUNC('month', "accessedOn") AS date
    FROM "url_metrics"
    WHERE "urlId" = ${urlId}
      AND "accessedOn" BETWEEN ${startDateUtc} AND ${endDateUtc}
    GROUP BY DATE_TRUNC('month', "accessedOn")
    ORDER BY date DESC;`;
  }

  const sorted = results?.map((item) => ({
    count: Number(item.count),
    date: item.date,
  }));

  return sorted;
};

export const UrlMetricService = {
  getFromDB,
  getUrlClicksCountCustomersFromDB,
  getUrlClicksStatFromDB,
  getUrlStatsBreakdownFromDB,
};
