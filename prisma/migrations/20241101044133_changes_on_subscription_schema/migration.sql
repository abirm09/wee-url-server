/*
  Warnings:

  - You are about to drop the column `provider` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriptionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `user_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "provider";

-- CreateIndex
CREATE UNIQUE INDEX "payments_subscriptionId_key" ON "payments"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_transactions_paymentId_key" ON "user_transactions"("paymentId");
