import { Profile, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { prisma } from "../../../../app";
import config from "../../../../config";
import ApiError from "../../../../errors/ApiError";
import { TJWTPayload } from "../../../../types/jwt/payload";
import deleteImageFromCloudinary from "../../../../utilities/cloudinary/deleteImageFromCloudinary";
import { RedisUtils } from "../../../../utilities/redis";
import { UserUtil } from "./user.util";

/**
 * The function `createIntoDB` asynchronously creates a new user in a database with hashed password and
 * associated profile.
 * @param {User} payload - The `payload` parameter in the `createIntoDB` function represents an object
 * containing user data. It likely includes properties such as `email`, `password`, and other
 * user-related information needed to create a new user entry in the database.
 */
const createIntoDB = async (payload: User) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds
  );

  await prisma.$transaction(async (tx) => {
    const userId = UserUtil.createId();
    const existingUser = await tx.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "An account is already registered with this email"
      );
    }

    const userData: User = {
      ...payload,
      userId,
      status: "active",
      password: hashedPassword,
      isEmailVerified: false,
      role: "customer",
      emailVerifiedAt: null,
    };

    const user = await tx.user.create({ data: userData });

    let freeSubscriptionPlan =
      await RedisUtils.getSubscriptionPlanCache("free");

    if (!freeSubscriptionPlan) {
      freeSubscriptionPlan = await tx.subscriptionPlan.findUnique({
        where: { type: "free" },
      });
      if (freeSubscriptionPlan) {
        await RedisUtils.setSubscriptionPlanCache("free", freeSubscriptionPlan);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscriptionData: any = {
      userId: user.id,
      planId: freeSubscriptionPlan.id,
    };
    await tx.subscription.create({
      data: subscriptionData,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userCreditData: any = {
      userId: user.id,
    };

    await tx.userCredit.create({
      data: userCreditData,
    });

    // Create user profile
    await tx.profile.create({
      data: {
        userId: user.id,
      },
    });
  });
};

/**
 * The function `profileFromDB` retrieves a user's profile information from a database using Prisma ORM
 * in TypeScript.
 * @param {string} id - The `id` parameter is a string that represents the unique identifier of a user
 * in the database. The `profileFromDB` function is an asynchronous function that retrieves a user's
 * profile information from the database based on the provided `id`. The function uses Prisma to query
 * the database and fetch specific
 * @returns The `profileFromDB` function is returning a user profile object from the database based on
 * the provided `id`. The object includes the user's `id`, `fullName`, `userId`, `email`,
 * `isEmailVerified`, `needsPasswordChange`, `role`, `status`, and the `picture` from the user's
 * profile.
 */
const profileFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      userId: true,
      email: true,
      isEmailVerified: true,
      needsPasswordChange: true,
      role: true,
      status: true,
      profile: {
        select: {
          picture: true,
        },
      },
    },
  });
  return result;
};

/**
 * The function `updateUserIntoDB` updates user and profile data in the database based on the provided
 * user data, profile data, and user information.
 * @param {User} userUpdatedData - The `userUpdatedData` parameter contains the updated information of
 * a user, such as their name, email, or any other user-related data that needs to be updated in the
 * database.
 * @param {Profile} profile - Profile data to be updated for the user, including fields like picture,
 * bio, and social media links.
 * @param {TJWTPayload} user - The `user` parameter in the `updateUserIntoDB` function represents the
 * current user making the update request. It contains information about the user, such as their user
 * ID and email address. This information is used to identify the user whose data is being updated in
 * the database.
 * @returns The `updateUserIntoDB` function is returning a Promise that resolves when the transaction
 * is completed.
 */
const updateUserIntoDB = async (
  userUpdatedData: User,
  profile: Profile,
  user: TJWTPayload
) => {
  return prisma.$transaction(async (tx) => {
    const findUser = await RedisUtils.getUserCache(user.userId);

    const userId = user.userId;
    const currentEmail = findUser?.email;

    // Prepare modified user data
    const modifiedUserData = {
      ...userUpdatedData,
      ...(userUpdatedData?.email && userUpdatedData?.email !== currentEmail
        ? { email: userUpdatedData.email, isEmailVerified: false }
        : {}),
    };

    // Update user data if there are any changes
    if (Object.keys(modifiedUserData).length) {
      await tx.user.update({
        where: { id: userId },
        data: modifiedUserData,
      });
    }

    // Update profile data if there are any changes
    if (Object.keys(profile).length) {
      if (profile.picture) {
        const previousProfileData = await tx.profile.findUnique({
          where: { userId },
          select: {
            picPublicId: true,
          },
        });

        if (previousProfileData?.picPublicId) {
          await deleteImageFromCloudinary([previousProfileData?.picPublicId]);
        }
      }
      await tx.profile.update({
        where: { userId: userId },
        data: {
          ...profile,
        },
      });
    }
  });
};

export const UserService = {
  createIntoDB,
  profileFromDB,
  updateUserIntoDB,
};
