/*
  Warnings:

  - Added the required column `clave` to the `Perfil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Perfil" ADD COLUMN     "clave" TEXT NOT NULL;
