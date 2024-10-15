/*
  Warnings:

  - You are about to drop the column `accessTokenId` on the `blocked_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenId` on the `logged_in_devices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenId]` on the table `logged_in_devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `blocked_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenId` to the `logged_in_devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "logged_in_devices_refreshTokenId_key";

-- AlterTable
ALTER TABLE "blocked_tokens" DROP COLUMN "accessTokenId",
ADD COLUMN     "tokenId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "logged_in_devices" DROP COLUMN "refreshTokenId",
ADD COLUMN     "tokenId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "logged_in_devices_tokenId_key" ON "logged_in_devices"("tokenId");
