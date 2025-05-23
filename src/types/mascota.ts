// src/types/mascota.ts

import { Especie, Sexo, Esterilizacion } from "@prisma/client";

export type Mascota = {
  id: number;
  nombre: string;
  especie: Especie;
  fechaNacimiento?: string;
  sexo: Sexo;
  esterilizado: Esterilizacion;
  microchip?: string | null;
  activo: boolean;
  raza?: { nombre: string } | null;
  perfil?: { id: number; nombre: string } | null;
};