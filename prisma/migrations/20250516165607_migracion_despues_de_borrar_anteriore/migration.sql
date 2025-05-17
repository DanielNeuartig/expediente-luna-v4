-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('CEO', 'ADMINISTRADOR', 'MEDICO', 'AUXILIAR', 'PROPIETARIO');

-- CreateEnum
CREATE TYPE "TipoAcceso" AS ENUM ('SMS_ENVIO', 'SMS_VERIFICACION', 'LOGIN', 'REGISTRO', 'REGISTRO_PERFIL', 'SMS_DISPONIBILIDAD', 'GET_USUARIO_ACTUAL');

-- CreateEnum
CREATE TYPE "Especie" AS ENUM ('CANINO', 'FELINO', 'AVE', 'REPTIL', 'ROEDOR', 'OTRO');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MACHO', 'HEMBRA', 'DESCONOCIDO');

-- CreateEnum
CREATE TYPE "Esterilizacion" AS ENUM ('ESTERILIZADO', 'NO_ESTERILIZADO', 'DESCONOCIDO');

-- CreateEnum
CREATE TYPE "TipoExpediente" AS ENUM ('CONSULTA', 'CIRUGIA', 'HOSPITALIZACION', 'LABORATORIO', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoClinica" AS ENUM ('PRIVADA', 'PUBLICA', 'MOVIL', 'OTRO');

-- CreateEnum
CREATE TYPE "ViaMedicamento" AS ENUM ('ORAL', 'SC', 'IM', 'IV', 'OTICA', 'OFTALMICA', 'TOPICA', 'OTRO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "name" TEXT,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "tipoUsuario" "TipoUsuario" NOT NULL DEFAULT 'PROPIETARIO',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "prefijo" TEXT,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "telefonoPrincipal" TEXT NOT NULL,
    "telefonoSecundario1" TEXT,
    "telefonoSecundario2" TEXT,
    "telefonoVerificado" BOOLEAN NOT NULL DEFAULT false,
    "documentoId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER,
    "autorId" INTEGER,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" "Especie" NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "esterilizado" "Esterilizacion" NOT NULL,
    "color" TEXT,
    "señas" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "microchip" TEXT,
    "alergias" TEXT,
    "imagen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "razaId" INTEGER,
    "perfilId" INTEGER NOT NULL,
    "autorId" INTEGER,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpedienteMedico" (
    "id" SERIAL NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "autorId" INTEGER NOT NULL,
    "clinicaId" INTEGER,
    "tipo" "TipoExpediente" NOT NULL,
    "contenidoAdaptado" TEXT,
    "notasGenerales" TEXT,
    "visibleParaTutor" BOOLEAN NOT NULL DEFAULT false,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpedienteMedico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotaClinica" (
    "id" SERIAL NOT NULL,
    "expedienteId" INTEGER NOT NULL,
    "historiaClinica" TEXT,
    "exploracionFisica" TEXT,
    "temperatura" DOUBLE PRECISION,
    "peso" DOUBLE PRECISION,
    "frecuenciaCardiaca" INTEGER,
    "frecuenciaRespiratoria" INTEGER,
    "diagnosticoPresuntivo" TEXT,
    "pronostico" TEXT,
    "archivos" TEXT,
    "laboratoriales" TEXT,
    "extras" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotaClinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "id" SERIAL NOT NULL,
    "notaClinicaId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "dosis" TEXT NOT NULL,
    "via" "ViaMedicamento" NOT NULL,
    "veces" INTEGER,
    "desde" TIMESTAMP(3),
    "incluirEnReceta" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AplicacionMedicamento" (
    "id" SERIAL NOT NULL,
    "notaClinicaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "dosis" TEXT,
    "ejecutorId" INTEGER,
    "observaciones" TEXT,
    "omitida" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AplicacionMedicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicacion" (
    "id" SERIAL NOT NULL,
    "notaClinicaId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cada" TEXT,
    "desde" TIMESTAMP(3),
    "veces" INTEGER,
    "incluirEnReceta" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Indicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AplicacionIndicacion" (
    "id" SERIAL NOT NULL,
    "notaClinicaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "ejecutorId" INTEGER,
    "observaciones" TEXT,
    "omitida" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AplicacionIndicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Raza" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" "Especie" NOT NULL,

    CONSTRAINT "Raza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinica" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipo" "TipoClinica" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioClinica" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioClinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acceso" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "ip" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoAcceso" "TipoAcceso" NOT NULL,
    "detalle" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Acceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_telefonoPrincipal_key" ON "Perfil"("telefonoPrincipal");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_usuarioId_key" ON "Perfil"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Mascota_microchip_key" ON "Mascota"("microchip");

-- CreateIndex
CREATE UNIQUE INDEX "Raza_nombre_especie_key" ON "Raza"("nombre", "especie");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioClinica_usuarioId_clinicaId_key" ON "UsuarioClinica"("usuarioId", "clinicaId");

-- CreateIndex
CREATE INDEX "Acceso_usuarioId_tipoAcceso_fecha_idx" ON "Acceso"("usuarioId", "tipoAcceso", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_razaId_fkey" FOREIGN KEY ("razaId") REFERENCES "Raza"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpedienteMedico" ADD CONSTRAINT "ExpedienteMedico_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpedienteMedico" ADD CONSTRAINT "ExpedienteMedico_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpedienteMedico" ADD CONSTRAINT "ExpedienteMedico_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaClinica" ADD CONSTRAINT "NotaClinica_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "ExpedienteMedico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamento" ADD CONSTRAINT "Medicamento_notaClinicaId_fkey" FOREIGN KEY ("notaClinicaId") REFERENCES "NotaClinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionMedicamento" ADD CONSTRAINT "AplicacionMedicamento_notaClinicaId_fkey" FOREIGN KEY ("notaClinicaId") REFERENCES "NotaClinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionMedicamento" ADD CONSTRAINT "AplicacionMedicamento_ejecutorId_fkey" FOREIGN KEY ("ejecutorId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicacion" ADD CONSTRAINT "Indicacion_notaClinicaId_fkey" FOREIGN KEY ("notaClinicaId") REFERENCES "NotaClinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionIndicacion" ADD CONSTRAINT "AplicacionIndicacion_notaClinicaId_fkey" FOREIGN KEY ("notaClinicaId") REFERENCES "NotaClinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacionIndicacion" ADD CONSTRAINT "AplicacionIndicacion_ejecutorId_fkey" FOREIGN KEY ("ejecutorId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioClinica" ADD CONSTRAINT "UsuarioClinica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioClinica" ADD CONSTRAINT "UsuarioClinica_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acceso" ADD CONSTRAINT "Acceso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
