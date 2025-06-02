/*
  Warnings:

  - You are about to drop the column `archivos` on the `NotaClinica` table. All the data in the column will be lost.
  - You are about to drop the `ArchivoLaboratorial` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoArchivoClinico" AS ENUM ('PDF', 'PNG', 'JPG', 'JPEG', 'OTRO');

-- DropForeignKey
ALTER TABLE "ArchivoLaboratorial" DROP CONSTRAINT "ArchivoLaboratorial_solicitudId_fkey";

-- AlterTable
ALTER TABLE "NotaClinica" DROP COLUMN "archivos";

-- DropTable
DROP TABLE "ArchivoLaboratorial";

-- DropEnum
DROP TYPE "TipoArchivoLaboratorial";

-- CreateTable
CREATE TABLE "ArchivoClinico" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoArchivoClinico" NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solicitudLaboratorialId" INTEGER,
    "notaClinicaId" INTEGER,

    CONSTRAINT "ArchivoClinico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArchivoClinico_solicitudLaboratorialId_idx" ON "ArchivoClinico"("solicitudLaboratorialId");

-- CreateIndex
CREATE INDEX "ArchivoClinico_notaClinicaId_idx" ON "ArchivoClinico"("notaClinicaId");

-- AddForeignKey
ALTER TABLE "ArchivoClinico" ADD CONSTRAINT "ArchivoClinico_solicitudLaboratorialId_fkey" FOREIGN KEY ("solicitudLaboratorialId") REFERENCES "SolicitudLaboratorial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoClinico" ADD CONSTRAINT "ArchivoClinico_notaClinicaId_fkey" FOREIGN KEY ("notaClinicaId") REFERENCES "NotaClinica"("id") ON DELETE SET NULL ON UPDATE CASCADE;
