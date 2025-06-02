/*
  Warnings:

  - You are about to drop the column `generarAplicaciones` on the `Indicacion` table. All the data in the column will be lost.
  - You are about to drop the column `generarAplicaciones` on the `Medicamento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Indicacion" DROP COLUMN "generarAplicaciones",
ADD COLUMN     "paraCasa" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Medicamento" DROP COLUMN "generarAplicaciones",
ADD COLUMN     "paraCasa" BOOLEAN NOT NULL DEFAULT false;
