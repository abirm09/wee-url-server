import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { env } from "../config";
import { Logger } from "../utilities";
const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction(async (tx) => {
    const superAdmin = await tx.user.findFirst({
      where: { userId: "testAdmin" },
    });
    if (superAdmin) {
      Logger.console.info("Test admin already exist.");
    } else {
      Logger.console.info("No test admin found. Creating new...");

      const password = await bcrypt.hash(
        String(env.test_admin.password),
        env.bcrypt_salt_rounds
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
        userId: "testAdmin",
        fullName: "Test admin",
        email: env.test_admin.email,
        password,
        emailVerifiedAt: new Date(),
        isEmailVerified: true,
        role: "admin",
      };
      const user = await tx.user.create({ data });
      Logger.console.info("Test admin created successfully.");
      await tx.profile.create({
        data: {
          userId: user.id,
        },
      });
      Logger.console.info("Test admin profile created successfully.");
    }
  });
};

main()
  .catch((err) => Logger.console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
