import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../config";
import { logger } from "../utilities/logger/logger";
const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction(async (tx) => {
    const superAdmin = await tx.user.findFirst({
      where: { role: "superAdmin" },
    });
    if (superAdmin) {
      logger.console.info("Super admin already exist.");
    } else {
      logger.console.info("No super admin found. Creating new...");

      const password = await bcrypt.hash(
        config.super_admin_data.password,
        config.bcrypt_salt_rounds
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
        userId: "superAdmin1",
        fullName: config.super_admin_data.full_name,
        email: config.super_admin_data.email,
        password,
        emailVerifiedAt: new Date(),
        isEmailVerified: true,
        role: "superAdmin",
      };
      const user = await tx.user.create({ data });
      logger.console.info("Super admin created successfully.");
      await tx.profile.create({
        data: {
          userId: user.id,
        },
      });
      logger.console.info("Super admin profile created successfully.");
    }
  });
};

main()
  .catch((err) => logger.console.info(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
