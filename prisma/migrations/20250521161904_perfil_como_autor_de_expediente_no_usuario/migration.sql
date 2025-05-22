-- DropForeignKey
ALTER TABLE "ExpedienteMedico" DROP CONSTRAINT "ExpedienteMedico_autorId_fkey";

-- AddForeignKey
ALTER TABLE "ExpedienteMedico" ADD CONSTRAINT "ExpedienteMedico_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
