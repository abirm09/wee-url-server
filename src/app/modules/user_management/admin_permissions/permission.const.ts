import { AdminPermissionEnum } from "@prisma/client";

const adminPermissions: AdminPermissionEnum[] =
  Object.values(AdminPermissionEnum);

export const PermissionConst = {
  adminPermissions,
};
