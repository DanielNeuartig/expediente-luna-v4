/*
  Warnings:

  - You are about to drop the column `rol` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('CEO', 'ADMINISTRADOR', 'MEDICO', 'AUXILIAR', 'PROPIETARIO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rol",
ADD COLUMN     "tipoUsuario" "TipoUsuario" NOT NULL DEFAULT 'PROPIETARIO';

-- DropEnum
DROP TYPE "Rol";
