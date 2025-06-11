"use client";

import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../toaster";
import ArchivoPreview from "../archivoPreview";
import DrawerResultadosGPT from "../laboratorio/DrawerResultadosGPT";
import type { ResultadoMascota } from "../BoxMascota";
import type { ResultadoGPT } from "../laboratorio/DrawerResultadosGPT";
type Archivo = {
  id: number;
  nombre: string;
  tipo: string;
  fechaSubida: string;
};

type Props = {
  mascota: ResultadoMascota;
  tipoEstudioId?: string;
  solicitudId?: number;
  fechaToma?: string;
  estudio?: string;
  token: string;
  archivos: Archivo[];
  proveedor?: string;
  onActualizar: () => void;
};

export default function ListaArchivosSubidos({
  token,
  archivos,
  proveedor,
  onActualizar,
  mascota,
  tipoEstudioId,
  solicitudId,
  fechaToma,
  estudio,
}: Props) {
  const [analizandoId, setAnalizandoId] = useState<number | null>(null);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [resultadosAnalisis, setResultadosAnalisis] = useState<{ datos: ResultadoGPT[] } | null>(null);

  if (archivos.length === 0) return null;

  return (
    <Box bg="tema.suave" p={4} mt={6} borderRadius="xl">
      <Badge bg="tema.llamativo" p="4" borderRadius="xl" mb="3">
        <Text fontSize="xl" fontWeight="bold" color="tema.claro">
          Archivos subidos
        </Text>
      </Badge>

      <VStack align="start" gap={4}>
        {archivos.map((archivo) => (
          <Box
            key={archivo.id}
            p={3}
            w="full"
            borderWidth="0px"
            borderRadius="xl"
            bg="tema.intenso"
          >
            <VStack align="start" gap={3}>
              {/* Nombre y fecha */}
              <VStack align="start" gap={2} w="full">
                <Badge
                  fontSize="sm"
                  p="1"
                  bg="tema.llamativo"
                  fontWeight="md"
                  color="tema.claro"
                  maxW="90%"
                  whiteSpace="normal"
                  display="block"
                  mx="auto"
                >
                  {archivo.nombre}
                </Badge>

                <Badge
                  fontSize="xs"
                  p="1"
                  bg="tema.suave"
                  fontWeight="md"
                  color="tema.claro"
                  maxW="90%"
                  whiteSpace="normal"
                  display="block"
                  mx="auto"
                >
                  {archivo.tipo} · Subido el{" "}
                  {new Date(archivo.fechaSubida).toLocaleDateString("es-MX")}
                </Badge>

                <Box w="full" textAlign="center">
                  <ArchivoPreview token={token} archivoId={archivo.id} />
                </Box>
              </VStack>

              {/* Botones */}
              <HStack gap={2} wrap="wrap" mx="center">
                {proveedor === "ELDOC" && (
                  <Button
                    animation="floatGlow"
                    bg="tema.llamativo"
                    color="white"
                    size="sm"
                    borderRadius="xl"
                    loading={analizandoId === archivo.id}
                    onClick={async () => {
                      const toastId = toaster.create({
                        description: "Analizando con IA...",
                        type: "loading",
                      });

                      setAnalizandoId(archivo.id);
                      try {
                        const res = await fetch("/api/procesarTemporal", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ token, id: archivo.id }),
                        });

                        if (!res.ok) throw new Error("Fallo en el análisis");

                        const json = await res.json();
                        setResultadosAnalisis(json);
                        setDrawerAbierto(true);

                        toaster.dismiss(toastId);
                        toaster.create({
                          description: "Análisis completado exitosamente",
                          type: "success",
                        });
                      } catch (e) {
                        console.error("Error al analizar con GPT:", e);
                        toaster.dismiss(toastId);
                        toaster.create({
                          description: "Error al analizar el archivo",
                          type: "error",
                        });
                      } finally {
                        setAnalizandoId(null);
                      }
                    }}
                  >
                    Analizar
                  </Button>
                )}

                <Button
                  bg="tema.rojo"
                  color="tema.claro"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `/api/estudios/${token}/archivo/${archivo.id}`,
                        { method: "DELETE" }
                      );
                      if (!res.ok) throw new Error("Error al borrar archivo");

                      onActualizar();

                      toaster.create({
                        description: "Archivo eliminado",
                        type: "success",
                      });
                    } catch (e) {
                      console.error("Error al borrar archivo:", e);
                      toaster.create({
                        description: "No se pudo eliminar el archivo",
                        type: "error",
                      });
                    }
                  }}
                >
                  Eliminar
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </VStack>

      {resultadosAnalisis && (
        <DrawerResultadosGPT
          isOpen={drawerAbierto}
          onClose={() => setDrawerAbierto(false)}
          resultados={resultadosAnalisis}
          mascota={mascota}
          solicitudId={solicitudId}
          tipoEstudioId={tipoEstudioId}
          fechaToma={fechaToma}
          estudio={estudio}
        />
      )}
    </Box>
  );
}