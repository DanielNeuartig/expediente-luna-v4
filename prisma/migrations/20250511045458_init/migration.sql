/*
  Warnings:

  - You are about to drop the column `perfilId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_perfilId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "perfilId";
