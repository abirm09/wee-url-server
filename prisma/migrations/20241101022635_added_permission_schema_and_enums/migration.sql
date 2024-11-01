-- CreateEnum
CREATE TYPE "AdminPermissionEnum" AS ENUM ('update_subscription_plan', 'manage_customer', 'create_admin', 'update_admin');

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" TEXT NOT NULL,
    "name" "AdminPermissionEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdminPermissionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_name_key" ON "admin_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminPermissionToUser_AB_unique" ON "_AdminPermissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminPermissionToUser_B_index" ON "_AdminPermissionToUser"("B");

-- AddForeignKey
ALTER TABLE "_AdminPermissionToUser" ADD CONSTRAINT "_AdminPermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "admin_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminPermissionToUser" ADD CONSTRAINT "_AdminPermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
