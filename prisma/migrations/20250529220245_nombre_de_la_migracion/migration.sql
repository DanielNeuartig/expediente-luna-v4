/*
  Warnings:

  - You are about to drop the column `cerrado` on the `SolicitudLaboratorial` table. All the data in the column will be lost.
  - Added the required column `fechaTomaDeMuestra` to the `SolicitudLaboratorial` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoSolicitudLaboratorial" AS ENUM ('EN_REVISION', 'FIRMADA', 'FINALIZADA', 'ANULADA');

-- AlterTable
ALTER TABLE "SolicitudLaboratorial" DROP COLUMN "cerrado",
ADD COLUMN     "estado" "EstadoSolicitudLaboratorial" NOT NULL DEFAULT 'EN_REVISION',
ADD COLUMN     "fechaTomaDeMuestra" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "estudio" DROP NOT NULL;
