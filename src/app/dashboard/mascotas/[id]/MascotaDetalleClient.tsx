"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import BoxMascota from "@/components/ui/BoxMascota";
import BotoneraExpediente from "@/components/ui/BotonesCrearExpediente";
import ListaExpedientesMascota, {
  ExpedienteConNotas,
} from "@/components/ui/ListaExpedientesMascota";
import FormularioNotaClinica from "@/components/ui/notaClinica/FormularioNotaClinica";
import { Sexo, Esterilizacion, Especie } from "@prisma/client";
import ListaAplicacionesMedicamento from "@/components/ui/aplicaciones/ListaAplicacionesMedicamento";
import type { Aplicacion } from "@/components/ui/aplicaciones/aplicaciones";
//import { useEffect } from "react";


type Mascota = {
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

export default function MascotaDetalleClient({
  mascota,
  
}: {
  
  mascota: Mascota;
}) {
  const [expedienteSeleccionado, setExpedienteSeleccionado] =
    useState<ExpedienteConNotas | null>(null);
  const [mostrarFormularioNota, setMostrarFormularioNota] = useState(true);
const [aplicacionesMedicamentos, setAplicacionesMedicamentos] = useState<Aplicacion[]>([]); 
  return (
    <>
      <Box gridColumn="1" gridRow="1">
        <TarjetaBase>
          <BoxMascota
            redirigirPerfil
            mascota={{
              id: mascota.id,
              nombre: mascota.nombre,
              tipo: "mascota",
              especie: mascota.especie,
              fechaNacimiento: mascota.fechaNacimiento,
              sexo: mascota.sexo,
              esterilizado: mascota.esterilizado,
              microchip: mascota.microchip ?? undefined,
              activo: mascota.activo,
              raza: mascota.raza?.nombre ?? undefined,
              perfilId: mascota.perfil?.id,
              nombrePerfil: mascota.perfil?.nombre,
            }}
          />
          <BotoneraExpediente mascotaId={mascota.id} />

          <TarjetaBase>
            <ListaExpedientesMascota
              mascotaId={mascota.id}
              expedienteSeleccionado={expedienteSeleccionado}
              setExpedienteSeleccionado={(expediente) => {
                setExpedienteSeleccionado(expediente);
                setMostrarFormularioNota(true);
              }}
              setAplicacionesMedicamentos={setAplicacionesMedicamentos} //
            />
          </TarjetaBase>
        </TarjetaBase>
      </Box>

      {(mostrarFormularioNota || aplicacionesMedicamentos.length > 0) && (
        <Box gridColumn="2" gridRow="1">
          <TarjetaBase>
            <ListaAplicacionesMedicamento
              aplicaciones={aplicacionesMedicamentos}
            />
          </TarjetaBase>

          {mostrarFormularioNota && expedienteSeleccionado && (
            <TarjetaBase>
              <FormularioNotaClinica
                expedienteSeleccionado={expedienteSeleccionado}
                mascotaId={mascota.id}
                onClose={() => setMostrarFormularioNota(false)}
              />
            </TarjetaBase>
          )}
        </Box>
      )}
    </>
  );
}
