-- DropForeignKey
ALTER TABLE "Perfil" DROP CONSTRAINT "Perfil_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Perfil" ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
