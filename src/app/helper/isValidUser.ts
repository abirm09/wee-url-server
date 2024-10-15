import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

const isValidUser = async (
  client:
    | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >,
  email: string,
  select: Prisma.UserSelect<DefaultArgs> | null | undefined
) => {
  const user = await client.user.findUnique({
    where: { email },
    select: { ...select, status: true },
  });
  if (!user)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No user found with this email."
    );
  if (user.status === "banned")
    throw new ApiError(httpStatus.BAD_REQUEST, "Your account has been banned.");

  return user;
};

export default isValidUser;
