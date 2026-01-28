/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "todos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT DEFAULT '',
    "priority" INTEGER DEFAULT 1,
    "complete" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);
