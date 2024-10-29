import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../config";
import { logger } from "../utilities/logger/logger";
const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction(async (tx) => {
    const superAdmin = await tx.user.findFirst({
      where: { userId: "testAdmin" },
    });
    if (superAdmin) {
      logger.console.info("Test admin already exist.");
    } else {
      logger.console.info("No test admin found. Creating new...");

      const password = await bcrypt.hash(
        String(config.test_admin.password),
        config.bcrypt_salt_rounds
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
        userId: "testAdmin",
        fullName: "Test admin",
        email: config.test_admin.email,
        password,
        emailVerifiedAt: new Date(),
        isEmailVerified: true,
        role: "admin",
      };
      const user = await tx.user.create({ data });
      logger.console.info("Test admin created successfully.");
      await tx.profile.create({
        data: {
          userId: user.id,
        },
      });
      logger.console.info("Test admin profile created successfully.");
    }
  });
};

main()
  .catch((err) => logger.console.info(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
