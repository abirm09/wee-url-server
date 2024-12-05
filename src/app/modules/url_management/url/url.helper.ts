import { SubscriptionPlan, Url } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { env } from "../../../../config";
import { ApiError } from "../../../../errorHandlers";
import { TJWTPayload } from "../../../../types";
import { TPrismaClientInstance } from "../../../../types/prisma/TPrismaClientInstance";
import { CacheManager, GenerateUrlShortCode } from "../../../../utilities";

const createNewUrl = async (
  url: Url,
  user: TJWTPayload,
  prisma: TPrismaClientInstance
) => {
  const userData = await prisma.user.findFirst({
    where: { id: user.userId },
    select: {
      subscriptions: {
        where: {
          isActive: true,
        },
        select: {
          plan: {
            select: {
              type: true,
            },
          },
        },
      },
      _count: {
        select: {
          urls: true,
        },
      },
    },
  });

  const subscriptionPlanType = userData?.subscriptions![0]?.plan?.type;
  if (!subscriptionPlanType)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to find user subscription."
    );

  let planData: SubscriptionPlan | null =
    await CacheManager.getSubscriptionPlanCache(
      userData?.subscriptions[0]?.plan?.type
    );

  if (!planData) {
    planData = await prisma.subscriptionPlan.findUnique({
      where: {
        type: subscriptionPlanType,
      },
    });
    await CacheManager.setSubscriptionPlanCache(subscriptionPlanType, planData);
  }
  if (!planData)
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

  if (
    planData?.maxURLsAllowed &&
    userData?._count?.urls >= planData?.maxURLsAllowed
  )
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You reached max url creation limit"
    );

  url.userId = user.userId;
  // if subscription plan allows create custom url short code
  if (planData.customURLSlug) {
    // if user gives input of short code
    if (url.shortCode) {
      const isShortCodeTaken = await prisma.url.findUnique({
        where: { shortCode: url.shortCode },
        select: {
          id: true,
        },
      });
      if (isShortCodeTaken)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `The short code '${url.shortCode}' is already taken.`
        );
    } else {
      url.shortCode = "";
    }
  } else {
    url.shortCode = "";
  }

  if (!url.shortCode) {
    const shortCode = GenerateUrlShortCode();
    url.shortCode = shortCode;
  }

  if (planData.canSetExpiration) {
    url.expiresAt = new Date(url.expiresAt as unknown as string);
  } else {
    url.expiresAt = null;
  }

  if (planData.canSetPassword) {
    if (url.password) {
      const hashedPassword = await bcrypt.hash(
        url.password,
        env.bcrypt_salt_rounds
      );
      url.password = hashedPassword;
    } else {
      url.password = null;
    }
  } else {
    url.password = null;
  }

  await prisma.url.create({
    data: url,
  });
};

export const URLHelper = {
  createNewUrl,
};
