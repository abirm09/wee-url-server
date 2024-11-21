/*
  Warnings:

  - You are about to drop the column `amount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `user_transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentProvider` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Made the column `subscriptionId` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user_transactions" DROP CONSTRAINT "user_transactions_couponId_fkey";

-- DropForeignKey
ALTER TABLE "user_transactions" DROP CONSTRAINT "user_transactions_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "user_transactions" DROP CONSTRAINT "user_transactions_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "user_transactions" DROP CONSTRAINT "user_transactions_userId_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount",
DROP COLUMN "paymentMethod",
DROP COLUMN "status",
ADD COLUMN     "cardBrand" TEXT,
ADD COLUMN     "cardLast4" INTEGER,
ADD COLUMN     "paymentProvider" "PaymentProvider" NOT NULL,
ADD COLUMN     "receiptUrl" TEXT,
ALTER COLUMN "subscriptionId" SET NOT NULL;

-- DropTable
DROP TABLE "user_transactions";

-- DropEnum
DROP TYPE "PaymentStatus";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
