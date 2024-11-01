-- CreateEnum
CREATE TYPE "UserAccountStatus" AS ENUM ('active', 'banned', 'pendingDelete', 'deleted');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "requestDeleteAt" TIMESTAMP(3),
ADD COLUMN     "status" "UserAccountStatus" NOT NULL DEFAULT 'active';
