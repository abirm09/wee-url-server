/*
  Warnings:

  - The values [deleted] on the enum `UserAccountStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserAccountStatus_new" AS ENUM ('active', 'banned', 'pendingDelete');
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserAccountStatus_new" USING ("status"::text::"UserAccountStatus_new");
ALTER TYPE "UserAccountStatus" RENAME TO "UserAccountStatus_old";
ALTER TYPE "UserAccountStatus_new" RENAME TO "UserAccountStatus";
DROP TYPE "UserAccountStatus_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;
