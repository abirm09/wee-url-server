import { Profile, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { prisma } from "../../../app";
import cloudinary from "../../../config/cloudinary";
import ApiError from "../../../errors/ApiError";
import { TJWTPayload } from "../../../types/jwt/payload";
import { UserUtil } from "./user.util";

/**
 * The function `createIntoDB` asynchronously creates a new user in a database with hashed password and
 * associated profile.
 * @param {User} payload - The `payload` parameter in the `createIntoDB` function represents an object
 * containing user data. It likely includes properties such as `email`, `password`, and other
 * user-related information needed to create a new user entry in the database.
 */
const createIntoDB = async (payload: User) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

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

    // Create user profile
    await tx.profile.create({
      data: {
        userId: user.id,
      },
    });
  });
};

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

const updateUserIntoDB = async (
  userUpdatedData: User,
  profile: Profile,
  user: TJWTPayload
) => {
  return prisma.$transaction(async (tx) => {
    const userId = user.userId;
    const currentEmail = user.user?.email;

    const previousProfileData = await prisma.profile.findUnique({
      where: { userId },
      select: {
        picPublicId: true,
      },
    });

    if (previousProfileData?.picPublicId) {
      await cloudinary.api.delete_resources([previousProfileData?.picPublicId]);
    }

    // Prepare modified user data
    const modifiedUserData = {
      ...userUpdatedData,
      ...(userUpdatedData.email && userUpdatedData.email !== currentEmail
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
      await tx.profile.update({
        where: { userId: userId },
        data: {
          ...profile, // Spread the profile fields to update
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
