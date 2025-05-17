/*
  Warnings:

  - The values [AVE,REPTIL] on the enum `Especie` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Especie_new" AS ENUM ('CANINO', 'FELINO', 'AVE_PSITACIDA', 'AVE_OTRA', 'OFIDIO', 'QUELONIO', 'LAGARTIJA', 'ROEDOR', 'LAGOMORFO', 'HURON', 'PORCINO', 'OTRO');
ALTER TABLE "Mascota" ALTER COLUMN "especie" TYPE "Especie_new" USING ("especie"::text::"Especie_new");
ALTER TABLE "Raza" ALTER COLUMN "especie" TYPE "Especie_new" USING ("especie"::text::"Especie_new");
ALTER TYPE "Especie" RENAME TO "Especie_old";
ALTER TYPE "Especie_new" RENAME TO "Especie";
DROP TYPE "Especie_old";
COMMIT;
