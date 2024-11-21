/*
  Warnings:

  - The values [refunded] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `discountAmount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `finalAmount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `user_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `finalCost` on the `user_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `newAmount` on the `user_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `originalCost` on the `user_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `usersCedit` on the `user_transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reqId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SubscriptionRequestStatus" AS ENUM ('pending', 'completed', 'expired', 'canceled');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('pending', 'completed', 'failed');
ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "discountAmount",
DROP COLUMN "finalAmount";

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "reqId" TEXT;

-- AlterTable
ALTER TABLE "user_transactions" DROP COLUMN "discountAmount",
DROP COLUMN "finalCost",
DROP COLUMN "newAmount",
DROP COLUMN "originalCost",
DROP COLUMN "usersCedit";

-- CreateTable
CREATE TABLE "subscription_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "billingPeriodId" TEXT NOT NULL,
    "status" "SubscriptionRequestStatus" NOT NULL DEFAULT 'pending',
    "couponId" TEXT,
    "userNewCreditRemarks" TEXT,
    "originalCost" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION,
    "usedUserCedit" DOUBLE PRECISION,
    "userNewCredit" DOUBLE PRECISION,
    "remainingUserCredit" DOUBLE PRECISION,
    "remainingPayableAmount" DOUBLE PRECISION,
    "finalCost" DOUBLE PRECISION NOT NULL,
    "strypeIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_reqId_key" ON "subscriptions"("reqId");

-- AddForeignKey
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_billingPeriodId_fkey" FOREIGN KEY ("billingPeriodId") REFERENCES "billing_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_reqId_fkey" FOREIGN KEY ("reqId") REFERENCES "subscription_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
