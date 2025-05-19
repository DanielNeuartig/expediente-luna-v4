/*
  Warnings:

  - You are about to drop the column `cada` on the `Indicacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Indicacion" DROP COLUMN "cada",
ADD COLUMN     "frecuenciaHoras" INTEGER;

-- AlterTable
ALTER TABLE "Medicamento" ADD COLUMN     "frecuenciaHoras" INTEGER;
