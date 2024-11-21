/*
  Warnings:

  - You are about to drop the column `isRefundable` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `refundedAmount` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriptionId]` on the table `user_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "isRefundable",
DROP COLUMN "refundedAmount";

-- CreateIndex
CREATE UNIQUE INDEX "user_transactions_subscriptionId_key" ON "user_transactions"("subscriptionId");
