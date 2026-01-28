/*
  Warnings:

  - Added the required column `tenant_id` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
