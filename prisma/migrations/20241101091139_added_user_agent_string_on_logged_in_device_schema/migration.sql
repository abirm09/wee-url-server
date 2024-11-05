/*
  Warnings:

  - You are about to drop the column `browser` on the `logged_in_devices` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `logged_in_devices` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `logged_in_devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "logged_in_devices" DROP COLUMN "browser",
DROP COLUMN "os",
DROP COLUMN "platform",
ADD COLUMN     "userAgent" TEXT;
