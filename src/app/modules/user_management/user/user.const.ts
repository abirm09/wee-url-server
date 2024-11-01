import { UsersRole } from "@prisma/client";

const userRoleEnum: UsersRole[] = ["superAdmin", "admin", "customer"];

export const UserConst = {
  userRoleEnum,
};
