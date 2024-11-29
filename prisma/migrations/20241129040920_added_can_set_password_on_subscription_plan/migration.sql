-- AlterTable
ALTER TABLE "_AdminPermissionToUser" ADD CONSTRAINT "_AdminPermissionToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AdminPermissionToUser_AB_unique";

-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "canSetPassword" BOOLEAN NOT NULL DEFAULT false;
