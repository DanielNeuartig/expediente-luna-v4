/*
  Warnings:

  - You are about to drop the column `canceladaPorId` on the `NotaClinica` table. All the data in the column will be lost.
  - Added the required column `estado` to the `ExpedienteMedico` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoExpediente" AS ENUM ('ACTIVO', 'FINALIZADO_MANUAL', 'FINALIZADO_AUTO');

-- DropForeignKey
ALTER TABLE "NotaClinica" DROP CONSTRAINT "NotaClinica_canceladaPorId_fkey";

-- AlterTable
ALTER TABLE "ExpedienteMedico" ADD COLUMN     "estado" "EstadoExpediente" NOT NULL,
ADD COLUMN     "fechaAlta" TIMESTAMP(3),
ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "ultimaActividad" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "NotaClinica" DROP COLUMN "canceladaPorId";

-- CreateIndex
CREATE INDEX "ExpedienteMedico_mascotaId_idx" ON "ExpedienteMedico"("mascotaId");

-- CreateIndex
CREATE INDEX "ExpedienteMedico_estado_idx" ON "ExpedienteMedico"("estado");
