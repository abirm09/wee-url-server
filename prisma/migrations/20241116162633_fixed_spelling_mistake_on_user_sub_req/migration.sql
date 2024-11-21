/*
  Warnings:

  - You are about to drop the column `usedUserCedit` on the `subscription_requests` table. All the data in the column will be lost.
  - You are about to drop the column `userNewCredit` on the `subscription_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_requests" DROP COLUMN "usedUserCedit",
DROP COLUMN "userNewCredit",
ADD COLUMN     "usedUserCredit" DOUBLE PRECISION;
