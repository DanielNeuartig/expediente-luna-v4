/*
  Warnings:

  - You are about to drop the `ArchivoClinico` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoArchivoLaboratorial" AS ENUM ('PDF', 'PNG', 'JPG', 'JPEG');

-- DropForeignKey
ALTER TABLE "ArchivoClinico" DROP CONSTRAINT "ArchivoClinico_notaClinicaId_fkey";

-- DropForeignKey
ALTER TABLE "ArchivoClinico" DROP CONSTRAINT "ArchivoClinico_solicitudLaboratorialId_fkey";

-- AlterTable
ALTER TABLE "NotaClinica" ADD COLUMN     "archivos" TEXT;

-- DropTable
DROP TABLE "ArchivoClinico";

-- DropEnum
DROP TYPE "TipoArchivoClinico";

-- CreateTable
CREATE TABLE "ArchivoLaboratorial" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoArchivoLaboratorial" NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchivoLaboratorial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArchivoLaboratorial_solicitudId_idx" ON "ArchivoLaboratorial"("solicitudId");

-- AddForeignKey
ALTER TABLE "ArchivoLaboratorial" ADD CONSTRAINT "ArchivoLaboratorial_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudLaboratorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
