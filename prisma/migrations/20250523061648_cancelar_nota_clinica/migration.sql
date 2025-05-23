-- AlterTable
ALTER TABLE "NotaClinica" ADD COLUMN     "activa" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "anuladaPorId" INTEGER,
ADD COLUMN     "canceladaPorId" INTEGER,
ADD COLUMN     "fechaCancelacion" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "NotaClinica" ADD CONSTRAINT "NotaClinica_canceladaPorId_fkey" FOREIGN KEY ("canceladaPorId") REFERENCES "NotaClinica"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaClinica" ADD CONSTRAINT "NotaClinica_anuladaPorId_fkey" FOREIGN KEY ("anuladaPorId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
