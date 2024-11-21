/*
  Warnings:

  - Made the column `reqId` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_reqId_fkey";

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "reqId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_reqId_fkey" FOREIGN KEY ("reqId") REFERENCES "subscription_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
