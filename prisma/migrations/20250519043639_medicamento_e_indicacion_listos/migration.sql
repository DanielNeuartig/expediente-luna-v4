/*
  Warnings:

  - You are about to drop the column `creadoEn` on the `AplicacionIndicacion` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `AplicacionIndicacion` table. All the data in the column will be lost.
  - You are about to drop the column `omitida` on the `AplicacionIndicacion` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `AplicacionMedicamento` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `AplicacionMedicamento` table. All the data in the column will be lost.
  - You are about to drop the column `omitida` on the `AplicacionMedicamento` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `Indicacion` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `Medicamento` table. All the data in the column will be lost.
  - Added the required column `creadorId` to the `AplicacionIndicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaProgramada` to the `AplicacionIndicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creadorId` to the `AplicacionMedicamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaProgramada` to the `AplicacionMedicamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `via` to the `AplicacionMedicamento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoAplicacion" AS ENUM ('PENDIENTE', 'REALIZADA', 'OMITIDA', 'CANCELADA');

-- AlterEnum
ALTER TYPE "TipoExpediente" ADD VALUE 'SEGUIMIENTO';

-- AlterTable
ALTER TABLE "AplicacionIndicacion" DROP COLUMN "creadoEn",
DROP COLUMN "fecha",
DROP COLUMN "omitida",
ADD COLUMN     "creadorId" INTEGER NOT NULL,
ADD COLUMN     "descripcionManual" TEXT,
ADD COLUMN     "estado" "EstadoAplicacion" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaProgramada" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaReal" TIMESTAMP(3),
ADD COLUMN     "indicacionId" INTEGER;

-- AlterTable
ALTER TABLE "AplicacionMedicamento" DROP COLUMN "creadoEn",
DROP COLUMN "fecha",
DROP COLUMN "omitida",
ADD COLUMN     "creadorId" INTEGER NOT NULL,
ADD COLUMN     "estado" "EstadoAplicacion" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaProgramada" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaReal" TIMESTAMP(3),
ADD COLUMN     "medicamentoId" INTEGER,
ADD COLUMN     "nombreMedicamentoManual" TEXT,
ADD COLUMN     "via" "ViaMedicamento" NOT NULL;

-- AlterTable
ALTER TABLE "Indicacion" DROP COLUMN "creadoEn",
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Medicamento" DROP COLUMN "creadoEn",
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "AplicacionIndicacion_notaClinicaId_estado_fechaProgramada_idx" ON "AplicacionIndicacion"("notaClinicaId", "estado", "fechaProgramada");

-- CreateIndex
CREATE INDEX "AplicacionMedicamento_notaClinicaId_estado_fechaProgramada_idx" ON "AplicacionMedicamento"("notaClinicaId", "estado", "fechaProgramada");

-- AddForeignKey
ALTER TABLE "AplicacionMedicamento" ADD CONSTRAINT "AplicacionMedicamento_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "Medicamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionMedicamento" ADD CONSTRAINT "AplicacionMedicamento_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionIndicacion" ADD CONSTRAINT "AplicacionIndicacion_indicacionId_fkey" FOREIGN KEY ("indicacionId") REFERENCES "Indicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionIndicacion" ADD CONSTRAINT "AplicacionIndicacion_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
