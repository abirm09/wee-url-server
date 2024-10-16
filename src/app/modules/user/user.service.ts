import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { UserUtil } from "./user.util";

const prisma = new PrismaClient();

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
  const result = await prisma.user.findUnique({ where: { id } });
  return result;
};

export const UserService = {
  createIntoDB,
  profileFromDB,
};
