import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { env } from "../config";
import { Logger } from "../utilities";
const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction(async (tx) => {
    const superAdmin = await tx.user.findFirst({
      where: { role: "superAdmin" },
    });
    if (superAdmin) {
      Logger.console.info("Super admin already exist.");
    } else {
      Logger.console.info("No super admin found. Creating new...");

      const password = await bcrypt.hash(
        env.super_admin_data.password,
        env.bcrypt_salt_rounds
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
        userId: "superAdmin1",
        fullName: env.super_admin_data.full_name,
        email: env.super_admin_data.email,
        password,
        emailVerifiedAt: new Date(),
        isEmailVerified: true,
        role: "superAdmin",
      };
      const user = await tx.user.create({ data });
      Logger.console.info("Super admin created successfully.");
      await tx.profile.create({
        data: {
          userId: user.id,
        },
      });
      Logger.console.info("Super admin profile created successfully.");
    }
  });
};

main()
  .catch((err) => Logger.console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
