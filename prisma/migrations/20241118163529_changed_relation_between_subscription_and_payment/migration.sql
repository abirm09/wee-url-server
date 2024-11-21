/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_reqId_fkey";

-- DropIndex
DROP INDEX "payments_subscriptionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "subscriptionId";

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "paymentId" TEXT,
ALTER COLUMN "reqId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_paymentId_key" ON "subscriptions"("paymentId");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_reqId_fkey" FOREIGN KEY ("reqId") REFERENCES "subscription_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
