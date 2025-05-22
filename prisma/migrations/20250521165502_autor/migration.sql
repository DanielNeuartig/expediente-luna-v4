/*
  Warnings:

  - Added the required column `autorId` to the `NotaClinica` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotaClinica" ADD COLUMN     "autorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "NotaClinica" ADD CONSTRAINT "NotaClinica_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
