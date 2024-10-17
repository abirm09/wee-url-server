/*
  Warnings:

  - You are about to drop the `blocked_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "logged_in_devices" ADD COLUMN     "blockedAt" TIMESTAMP(3),
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "blocked_tokens";
