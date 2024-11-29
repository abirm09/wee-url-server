import { PrismaClient } from "@prisma/client";
import { PermissionConst } from "../app/modules/user_management/admin_permissions/permission.const";
import { Logger } from "../utilities";
const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction(async (tx) => {
    // Retrieve all permissions currently in the database
    const existingPermissions = await tx.adminPermission.findMany({
      select: { name: true },
    });

    // Extract the names of existing permissions
    const existingPermissionNames = existingPermissions.map(
      (perm) => perm.name
    );

    // Find permissions that are missing in the database
    const missingPermissions = PermissionConst.adminPermissions.filter(
      (perm) => !existingPermissionNames.includes(perm)
    );

    // Insert missing permissions into the database
    if (missingPermissions.length > 0) {
      await tx.adminPermission.createMany({
        data: missingPermissions.map((perm) => ({ name: perm })),
      });

      Logger.console.info("Missing permissions added:", missingPermissions);
    } else {
      Logger.console.info(
        "All required permissions are already in the database"
      );
    }
  });
};

main()
  .catch((err) => Logger.console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
