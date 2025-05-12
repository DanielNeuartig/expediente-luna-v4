-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CEO', 'ADMIN', 'MEDICO', 'AUXILIAR', 'PROPIETARIO');

-- CreateEnum
CREATE TYPE "TipoAcceso" AS ENUM ('SMS_ENVIO', 'SMS_VERIFICACION', 'LOGIN', 'REGISTRO', 'REGISTRO_PERFIL', 'SMS_DISPONIBILIDAD', 'GET_USUARIO_ACTUAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'MEDICO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "name" TEXT,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "perfilId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telefonoPrincipal" TEXT NOT NULL,
    "telefonoSecundario1" TEXT,
    "telefonoSecundario2" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "creadoPorId" INTEGER,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinica" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
CREATE UNIQUE INDEX "User_perfilId_key" ON "User"("perfilId");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_telefonoPrincipal_key" ON "Perfil"("telefonoPrincipal");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_usuarioId_key" ON "Perfil"("usuarioId");

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
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
