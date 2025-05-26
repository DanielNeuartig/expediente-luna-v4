/*
  Warnings:

  - You are about to drop the column `laboratoriales` on the `NotaClinica` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoArchivoLaboratorial" AS ENUM ('PDF', 'PNG', 'JPG', 'JPEG');

-- AlterTable
ALTER TABLE "NotaClinica" DROP COLUMN "laboratoriales";

-- CreateTable
CREATE TABLE "SolicitudLaboratorial" (
    "id" SERIAL NOT NULL,
    "notaClinicaId" INTEGER NOT NULL,
    "estudio" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "observacionesClinica" TEXT,
    "observacionesLaboratorio" TEXT,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaSubida" TIMESTAMP(3),
    "cerrado" BOOLEAN NOT NULL DEFAULT false,
    "tokenAcceso" TEXT NOT NULL,
    "creadoPorId" INTEGER NOT NULL,
    "fechaCierre" TIMESTAMP(3),

    CONSTRAINT "SolicitudLaboratorial_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "SolicitudLaboratorial_tokenAcceso_key" ON "SolicitudLaboratorial"("tokenAcceso");

-- CreateIndex
CREATE INDEX "SolicitudLaboratorial_notaClinicaId_idx" ON "SolicitudLaboratorial"("notaClinicaId");

-- CreateIndex
CREATE INDEX "SolicitudLaboratorial_creadoPorId_idx" ON "SolicitudLaboratorial"("creadoPorId");

-- CreateIndex
CREATE INDEX "ArchivoLaboratorial_solicitudId_idx" ON "ArchivoLaboratorial"("solicitudId");

-- AddForeignKey
ALTER TABLE "SolicitudLaboratorial" ADD CONSTRAINT "SolicitudLaboratorial_notaClinicaId_fkey" FOREIGN KEY ("notaClinicaId") REFERENCES "NotaClinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudLaboratorial" ADD CONSTRAINT "SolicitudLaboratorial_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoLaboratorial" ADD CONSTRAINT "ArchivoLaboratorial_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudLaboratorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
