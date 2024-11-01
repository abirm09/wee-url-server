/*
  Warnings:

  - You are about to drop the column `minSubscription` on the `coupons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "minSubscription",
ADD COLUMN     "allowedSubscriptions" "SubscriptionType"[];

-- AlterTable
ALTER TABLE "payment_methods" ALTER COLUMN "paymentMethodId" DROP NOT NULL;
