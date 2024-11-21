/*
  Warnings:

  - You are about to drop the column `strypeIntentId` on the `subscription_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_requests" DROP COLUMN "strypeIntentId",
ADD COLUMN     "stripeIntentId" TEXT;
