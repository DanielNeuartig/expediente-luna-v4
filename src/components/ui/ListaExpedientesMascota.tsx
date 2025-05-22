"use client";

import { useQuery } from "@tanstack/react-query";
import { VStack, Box, Text, Spinner, HStack, Badge } from "@chakra-ui/react";
import { CalendarDays, FileText } from "lucide-react";
import type {
  /*AplicacionMedicamento,*/
  AplicacionIndicacion,
} from "@prisma/client";
//import { TemplateContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { Aplicacion } from "@/components/ui/aplicaciones/aplicaciones";
import { useEffect } from "react";
export type NotaClinicaExtendida = {
  id: number;
  historiaClinica?: string | null;
  exploracionFisica?: string | null;
  temperatura?: number | null;
  peso?: number | null;
  frecuenciaCardiaca?: number | null;
  frecuenciaRespiratoria?: number | null;
  diagnosticoPresuntivo?: string | null;
  pronostico?: string | null;
  laboratoriales?: string | null;
  extras?: string | null;
  fechaCreacion: string;
  autor?: {
    id: number;
    nombre: string;
  };
  medicamentos?: {
    id: number;
    nombre: string;
    dosis: string;
    via: string;
    frecuenciaHoras?: number | null;
    veces?: number | null;
    desde: string;
    observaciones?: string | null;
    incluirEnReceta: boolean;
    tiempoIndefinido: boolean;
  }[];
  indicaciones?: {
    id: number;
    descripcion: string;
    frecuenciaHoras?: number | null;
    veces?: number | null;
    desde: string;
    observaciones?: string | null;
    incluirEnReceta: boolean;
  }[];
};

export type ExpedienteConNotas = {
  id: number;
  tipo: string;
  fechaCreacion: string;
  contenidoAdaptado?: string | null;
  notasGenerales?: string | null;
  visibleParaTutor: boolean;
  borrado: boolean;
  autor?: {
    id: number;
    nombre: string;
  };
  notasClinicas: NotaClinicaExtendida[];
};

type AplicacionMedicamentoExtendida = Aplicacion & {
  medicamento: {
    nombre: string;
    dosis: string;
    via: string;
  } | null;
  ejecutor: {
    id: number;
    nombre: string;
  } | null;
};

/*type ApiResponse = {
  expedientes: ExpedienteConNotas[];
  aplicacionesMedicamentos: AplicacionMedicamento[];
  aplicacionesIndicaciones: AplicacionIndicacion[];
};*/

type Props = {
  mascotaId: number;
  expedienteSeleccionado: ExpedienteConNotas | null;
  setExpedienteSeleccionado: (exp: ExpedienteConNotas) => void;
  setAplicacionesMedicamentos: (apps: Aplicacion[]) => void;
};

export default function ListaExpedientesMascota({
  mascotaId,
  //expedienteSeleccionado,
  setExpedienteSeleccionado,
  setAplicacionesMedicamentos, //
}: Props) {
  const { data, isLoading, isError } = useQuery<{
    expedientes: ExpedienteConNotas[];
    aplicacionesMedicamentos: AplicacionMedicamentoExtendida[];
    aplicacionesIndicaciones: AplicacionIndicacion[];
  }>({
    queryKey: ["expedientes", mascotaId],
    queryFn: async () => {
      const res = await fetch(`/api/mascotas/${mascotaId}/expedientes`);
      if (!res.ok) throw new Error("Error al cargar expedientes");
      
      return res.json();
    },
    
  });
  useEffect(() => {
    if (data?.aplicacionesMedicamentos) {
      const transformadas: Aplicacion[] = data.aplicacionesMedicamentos.map(
        (a) => ({
          id: a.id,
          fechaProgramada: new Date(a.fechaProgramada).toISOString(),
          fechaReal: a.fechaReal ? new Date(a.fechaReal).toISOString() : null, // ✅ AÑADIDO
          estado: a.estado,
          medicamento: a.medicamento
            ? {
                nombre: a.medicamento.nombre,
                dosis: a.medicamento.dosis,
                via: a.medicamento.via,
              }
            : null,
          nombreMedicamentoManual: a.nombreMedicamentoManual ?? null,
          dosis: a.dosis ?? undefined,
          via: a.via ?? undefined,
          observaciones: a.observaciones ?? "",
          ejecutor: a.ejecutor
            ? {
                id: a.ejecutor.id,
                nombre: a.ejecutor.nombre,
              }
            : null,
        })
      );

      setAplicacionesMedicamentos(transformadas);
    }
  }, [data?.aplicacionesMedicamentos, setAplicacionesMedicamentos]);

  if (isLoading) return <Spinner />;
  if (isError) return <Text>Error al cargar los expedientes.</Text>;

  const expedientes = data?.expedientes ?? [];
  const aplicacionesMedicamentos = data?.aplicacionesMedicamentos ?? [];
  const aplicacionesIndicaciones = data?.aplicacionesIndicaciones ?? [];

  // ...

  return (
    <VStack alignItems="start" gap="4" width="full">
      <Text fontSize="xl" fontWeight="bold" color="tema.suave">
        Expedientes previos
      </Text>

      {expedientes.length === 0 ? (
        <Text fontStyle="italic" color="tema.suave">
          No hay expedientes registrados.
        </Text>
      ) : (
        expedientes.map((exp) => (
          <Box
            key={exp.id}
            backgroundColor="tema.intenso"
            padding="4"
            borderRadius="xl"
            width="full"
            border="1px solid"
            borderColor="tema.borde"
            onClick={() => setExpedienteSeleccionado(exp)}
          >
            <HStack justifyContent="space-between" mb="2">
              <HStack gap="2">
                <FileText size={20} />
                <Text fontWeight="bold">
                  Expediente #{exp.id} · {exp.tipo}
                </Text>
              </HStack>
              <Badge>
                <HStack>
                  <CalendarDays size={14} />
                  <Text fontSize="xs">
                    {new Date(exp.fechaCreacion).toLocaleString()}
                  </Text>
                </HStack>
              </Badge>
            </HStack>

            {exp.autor && (
              <Text fontSize="sm" mb="1">
                {exp.autor.nombre} (ID: {exp.autor.id})
              </Text>
            )}
            {exp.contenidoAdaptado && (
              <Text fontSize="sm">
                Contenido adaptado: {exp.contenidoAdaptado}
              </Text>
            )}
            {exp.notasGenerales && (
              <Text fontSize="sm">Notas generales: {exp.notasGenerales}</Text>
            )}
            <Text fontSize="sm">
              Visible para tutor: {exp.visibleParaTutor ? "Sí" : "No"}
            </Text>
            <Text fontSize="sm">¿Borrado?: {exp.borrado ? "Sí" : "No"}</Text>

            {exp.notasClinicas.length > 0 && (
              <VStack
                align="start"
                gap="3"
                mt="3"
                bg="tema.fondo"
                p="3"
                borderRadius="md"
              >
                {exp.notasClinicas.map((nota) => (
                  <Box
                    bg="tema.suave"
                    borderRadius="xl"
                    key={nota.id}
                    width="full"
                    borderBottom="1px solid #ccc"
                    pb="2"
                    pt="2"
                  >
                    <HStack>
                      <Text fontWeight="bold">🗒️ {nota.id}</Text>
                      <Badge>
                        <HStack>
                          <CalendarDays size={14} />
                          <Text fontSize="sm">
                            {new Date(nota.fechaCreacion).toLocaleString()}
                          </Text>
                        </HStack>
                      </Badge>
                    </HStack>
                    {nota.autor && (
                      <Text fontSize="sm" mt="1">
                        {nota.autor.nombre} (ID: {nota.autor.id})
                      </Text>
                    )}
                    <Box
                      border="4px"
                      borderColor="tema.llamativo"
                      p="4"
                      bg="tema.suave"
                      borderRadius="sm"
                    >
                      {nota.historiaClinica && (
                        <Text fontSize="sm" color="tema.claro">
                          Historia clínica: {nota.historiaClinica}
                        </Text>
                      )}

                      {nota.exploracionFisica && (
                        <Text fontSize="sm" color="tema.claro">
                          Exploración física: {nota.exploracionFisica}
                        </Text>
                      )}

                      {typeof nota.temperatura === "number" && (
                        <Text fontSize="sm" color="tema.claro">
                          Temperatura: {nota.temperatura} °C
                        </Text>
                      )}

                      {typeof nota.peso === "number" && (
                        <Text fontSize="sm" color="tema.claro">
                          Peso: {nota.peso} kg
                        </Text>
                      )}

                      {typeof nota.frecuenciaCardiaca === "number" && (
                        <Text fontSize="sm" color="tema.claro">
                          Frecuencia cardiaca: {nota.frecuenciaCardiaca} lpm
                        </Text>
                      )}

                      {typeof nota.frecuenciaRespiratoria === "number" && (
                        <Text fontSize="sm" color="tema.claro">
                          Frecuencia respiratoria: {nota.frecuenciaRespiratoria}{" "}
                          rpm
                        </Text>
                      )}

                      {nota.diagnosticoPresuntivo && (
                        <Text fontSize="sm" color="tema.claro">
                          Diagnóstico presuntivo: {nota.diagnosticoPresuntivo}
                        </Text>
                      )}

                      {nota.pronostico && (
                        <Text fontSize="sm" color="tema.claro">
                          Pronóstico: {nota.pronostico}
                        </Text>
                      )}

                      {nota.laboratoriales && (
                        <Text fontSize="sm" color="tema.claro">
                          Laboratoriales: {nota.laboratoriales}
                        </Text>
                      )}

                      {nota.extras && (
                        <Text fontSize="sm" color="tema.claro">
                          Extras: {nota.extras}
                        </Text>
                      )}
                    </Box>

                    {(nota.medicamentos ?? []).length > 0 && (
                      <Box
                        mt="2"
                        gap="4"
                        bg="tema.llamativo"
                        borderRadius="xl"
                        pb="1"
                        pt="1"
                      >
                        <Text fontWeight="semibold">💊 Medicamentos:</Text>
                        {(nota.medicamentos ?? []).map((m) => (
                          <Box key={m.id} fontSize="sm" pl="2">
                            <Text>---</Text>
                            <Text>
                              Nombre: {m.nombre}--{m.dosis}--{m.via}
                            </Text>
                            {m.frecuenciaHoras !== null && (
                              <Text>Frecuencia (h): {m.frecuenciaHoras}</Text>
                            )}
                            {m.veces !== null && <Text>Veces: {m.veces}</Text>}
                            <Text>
                              Desde: {new Date(m.desde).toLocaleString()}
                            </Text>
                            {m.observaciones && (
                              <Text>Observaciones: {m.observaciones}</Text>
                            )}
                            <Text>
                              Para receta: {m.incluirEnReceta ? "Sí" : "No"}
                            </Text>
                            <Text>
                              Indefinido: {m.tiempoIndefinido ? "Sí" : "No"}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {nota.indicaciones && nota.indicaciones.length > 0 && (
                      <Box mt="2">
                        <Text fontWeight="semibold">📋 Indicaciones:</Text>
                        {nota.indicaciones.map((i) => (
                          <Box key={i.id} fontSize="sm" pl="2">
                            <Text>Descripción: {i.descripcion}</Text>
                            {i.frecuenciaHoras !== null && (
                              <Text>Frecuencia (h): {i.frecuenciaHoras}</Text>
                            )}
                            {i.veces !== null && <Text>Veces: {i.veces}</Text>}
                            {i.desde && (
                              <Text>
                                Desde: {new Date(i.desde).toLocaleString()}
                              </Text>
                            )}
                            {i.observaciones && (
                              <Text>Observaciones: {i.observaciones}</Text>
                            )}
                            <Text>
                              Para receta: {i.incluirEnReceta ? "Sí" : "No"}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        ))
      )}

      {(aplicacionesMedicamentos.length > 0 ||
        aplicacionesIndicaciones.length > 0) && (
        <Box mt="6" width="full">
          <Text fontWeight="bold" fontSize="lg" color="tema.suave">
          Historial farmacológico 
          </Text>
          <VStack align="start" gap="2" mt="2">
            {aplicacionesMedicamentos.map((a) => (
              <Box key={`med-${a.id}`} fontSize="sm" color="tema.suave">
                💊{" "}
                {a.nombreMedicamentoManual ||
                  a.medicamento?.nombre ||
                  "Sin nombre"}
                · {new Date(a.fechaProgramada).toLocaleString()} · Estado:{" "}
                {a.estado}
              </Box>
            ))}
            {aplicacionesIndicaciones.map((a) => (
              <Box key={`ind-${a.id}`} fontSize="sm">
                📋{" "}
                {a.descripcionManual ||
                  `Indicacion ID: ${a.indicacionId}` ||
                  "Sin descripción"}{" "}
                · {new Date(a.fechaProgramada).toLocaleString()} · Estado:{" "}
                {a.estado}
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}
