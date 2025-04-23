/*
  Warnings:

  - The `accessedDeviceType` column on the `url_metrics` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccessedDeviceType" AS ENUM ('desktop', 'smartphone', 'tablet', 'television', 'smart display', 'camera', 'car', 'console', 'portable media player', 'phablet', 'wearable', 'smart speaker', 'feature phone', 'peripheral');

-- AlterTable
ALTER TABLE "url_metrics" DROP COLUMN "accessedDeviceType",
ADD COLUMN     "accessedDeviceType" "AccessedDeviceType" DEFAULT 'desktop';
