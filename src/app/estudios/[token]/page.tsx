"use client";

import {
  Box,
  FileUpload,
  Icon,
  Text,
  HStack,
  CloseButton,
  Stack,
  Spinner,
  Heading,
  VStack,
  Badge,
  Button,
} from "@chakra-ui/react";
import {
  ClipboardSignature,
  FlaskConical,
  Building2,
  StickyNote,
  CalendarClock,
} from "lucide-react";
import { LuUpload } from "react-icons/lu";
import { useState, useEffect } from "react";
import FondoConBotones from "@/components/ui/fondos/FondoConBotones";
import BoxMascota from "@/components/ui/BoxMascota";
import { useParams } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import type { ResultadoMascota } from "@/components/ui/BoxMascota";

type ArchivoLaboratorial = {
  id: number;
  url: string;
  nombre: string;
  tipo: string;
  fechaSubida: string;
};

const TIPOS_PERMITIDOS = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
];
const LIMITE_MB = 5;

type SolicitudLaboratorialPlano = {
  id: number;
  estudio?: string;
  proveedor: string;
  observacionesClinica?: string;
  fechaTomaDeMuestra: string;
};

export default function DemoUploadConBorrado() {
  const [subiendo, setSubiendo] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [mascota, setMascota] = useState<ResultadoMascota | null>(null);
  const [solicitud, setSolicitud] = useState<SolicitudLaboratorialPlano | null>(
    null
  );
  const [archivosCargados, setArchivosCargados] = useState<
    ArchivoLaboratorial[]
  >([]);
  const [cargando, setCargando] = useState(true);

  const params = useParams() as Record<string, string>;
  const token = params?.token;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevos = e.target.files ? Array.from(e.target.files) : [];
    const validos = nuevos.filter((archivo) => {
      if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        toaster.create({
          description: `Tipo no permitido: ${archivo.type}`,
          type: "error",
        });
        return false;
      }
      if (archivo.size > LIMITE_MB * 1024 * 1024) {
        toaster.create({
          description: `Archivo demasiado grande: ${archivo.name}`,
          type: "error",
        });
        return false;
      }
      return true;
    });
    setArchivos((prev) => [...prev, ...validos]);
  };

  const eliminarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!token) return;

    const obtenerDatos = async () => {
      try {
        const res = await fetch(`/api/estudios/${token}`);
        const data = await res.json();

        const rawMascota = data?.mascota;
        const rawSolicitud = data?.solicitud;

        if (rawMascota) {
          const mascotaAplanada: ResultadoMascota = {
            id: rawMascota.id,
            nombre: rawMascota.nombre,
            especie: rawMascota.especie,
            fechaNacimiento: rawMascota.fechaNacimiento,
            sexo: rawMascota.sexo,
            esterilizado: rawMascota.esterilizado,
            microchip: rawMascota.microchip ?? undefined,
            activo: rawMascota.activo ?? true,
            raza: rawMascota.raza?.nombre ?? undefined,
            perfilId: rawMascota.perfil?.id,
            nombrePerfil: rawMascota.perfil?.nombre ?? undefined,
            tipo: "mascota",
          };
          setMascota(mascotaAplanada);
        }

        if (rawSolicitud) {
          setSolicitud({
            id: rawSolicitud.id,
            estudio: rawSolicitud.estudio,
            proveedor: rawSolicitud.proveedor,
            observacionesClinica: rawSolicitud.observacionesClinica,
            fechaTomaDeMuestra: rawSolicitud.fechaTomaDeMuestra,
          });
          if (rawSolicitud.archivos) {
            setArchivosCargados(rawSolicitud.archivos);
          }
        }
      } catch (e) {
        console.error("Error al obtener datos:", e);
        toaster.create({
          description: "Error al cargar datos",
          type: "error",
        });
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [token]);

  async function subirArchivoAS3(token: string, archivo: File) {
    const res = await fetch(`/api/estudios/${token}/archivo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileType: archivo.type, fileName: archivo.name }),
    });

    if (!res.ok) throw new Error("No se pudo obtener URL firmada");

    const { url, key } = await res.json();

    const upload = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": archivo.type },
      body: archivo,
    });

    if (!upload.ok) throw new Error("Error al subir archivo a S3");

    return { key }; // ← nueva línea
  }

  return (
    <FondoConBotones>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        px={4}
      >
        <Box
          w={{ base: "90%", md: "90%", lg: "30%" }}
          bg="tema.intenso"
          borderRadius="2xl"
          shadow="lg"
          px={6}
          py={8}
          display="flex"
          flexDirection="column"
          gap={6}
          animation="fadeInUp"
        >
          {/* Datos de la mascota */}
          <Box bg="tema.suave" p={4} borderRadius="xl">
            <Heading size="lg" mb={4} color="tema.claro">
              Datos de la mascota
            </Heading>
            {cargando ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minH="120px"
              >
                <Spinner
                  animationDuration="1s"
                  borderWidth="9px"
                  size="xl"
                  color="tema.llamativo"
                  css={{ "--spinner-track-color": "colors.gray.100" }}
                />
              </Box>
            ) : mascota ? (
              <BoxMascota mascota={mascota} />
            ) : (
              <Text color="red.500">No se pudo cargar la mascota</Text>
            )}
          </Box>

          {/* Datos de la solicitud */}
          {/* Datos de la solicitud */}
          <Box bg="tema.suave" p={4} borderRadius="xl">
            <Heading size="lg" mb={4} color="tema.claro">
              Datos de la solicitud
            </Heading>

            {cargando ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minH="120px"
              >
                <Spinner
                  animationDuration="1s"
                  borderWidth="9px"
                  size="xl"
                  color="tema.llamativo"
                  css={{ "--spinner-track-color": "colors.gray.100" }}
                />
              </Box>
            ) : solicitud ? (
              <VStack align="start" gap={3} animation="fadeInUp">
                <HStack>
                  <Badge colorScheme="cyan" variant="solid">
                    <Icon as={ClipboardSignature} boxSize={4} mr={1} /> ID
                  </Badge>
                  <Text color="tema.claro" fontWeight="semibold">
                    {solicitud.id}
                  </Text>
                </HStack>

                <HStack>
                  <Badge colorScheme="blue" variant="solid">
                    <Icon as={FlaskConical} boxSize={4} mr={1} /> Estudio
                  </Badge>
                  <Text color="tema.claro" fontWeight="semibold">
                    {solicitud.estudio ?? "Sin especificar"}
                  </Text>
                </HStack>

                <HStack>
                  <Badge colorScheme="purple" variant="solid">
                    <Icon as={Building2} boxSize={4} mr={1} /> Proveedor
                  </Badge>
                  <Text color="tema.claro" fontWeight="semibold">
                    {solicitud.proveedor}
                  </Text>
                </HStack>

                <HStack alignItems="start">
                  <Badge colorScheme="orange" variant="solid">
                    <Icon as={StickyNote} boxSize={4} mr={1} /> Observaciones
                  </Badge>
                  <Text color="tema.claro" fontWeight="semibold">
                    {solicitud.observacionesClinica ?? "Sin observaciones"}
                  </Text>
                </HStack>

                <HStack>
                  <Badge colorScheme="green" variant="solid">
                    <Icon as={CalendarClock} boxSize={4} mr={1} /> Toma de
                    muestra
                  </Badge>
                  <Text fontSize="lg" color="tema.claro" fontWeight="semibold">
                    {new Date(solicitud.fechaTomaDeMuestra).toLocaleString(
                      "es-MX",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </Text>
                </HStack>
              </VStack>
            ) : (
              <Text color="red.500">No se pudo cargar la solicitud</Text>
            )}
          </Box>

          {/* Upload */}
          <Box bg="tema.intenso" p={4} borderRadius="xl" textAlign="center">
            <Heading size="xl" mb={4} color="tema.claro">
              Arrastra los archivos para subirlos
            </Heading>
            <Box animation={"pulseCloud"}>
              {subiendo ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minH="150px"
                >
                  <Spinner
                    animationDuration="1s"
                    borderWidth="9px"
                    size="xl"
                    color="tema.llamativo"
                    css={{ "--spinner-track-color": "colors.gray.100" }}
                  />
                </Box>
              ) : (
                <FileUpload.Root maxW="xl" alignItems="stretch">
                  <FileUpload.HiddenInput multiple onChange={handleChange} />
                  <FileUpload.Dropzone bg="white">
                    <Icon size="2xl" color="tema.llamativo">
                      <LuUpload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                      <Box fontSize="xl" color="tema.suave">
                        Arrastra y suelta archivos aquí o haz clic
                      </Box>
                      <Box color="tema.intenso">.png, .jpg, .pdf hasta 5MB</Box>
                      <Box color="tema.intenso">Máx. 5 archivos</Box>
                    </FileUpload.DropzoneContent>
                  </FileUpload.Dropzone>

                  {archivos.length > 0 && (
                    <>
                      <Stack mt={4}>
                        {archivos.map((archivo, index) => (
                          <HStack
                            key={index}
                            justify="space-between"
                            borderRadius="2xl"
                            px={3}
                            py={1}
                            bg="tema.suave"
                          >
                            <Text
                              fontSize="sm"
                              color="tema.claro"
                              fontWeight={"bold"}
                              truncate
                            >
                              {archivo.name}
                            </Text>
                            <CloseButton
                              onClick={() => eliminarArchivo(index)}
                            />
                          </HStack>
                        ))}
                      </Stack>
                      <Button
                        bg="tema.llamativo"
                        color="tema.claro"
                        mt={4}
                        colorScheme="teal"
                        size="md"
                        onClick={async () => {
  if (!token || archivos.length === 0) {
    toaster.create({
      description: "No hay archivos para subir",
      type: "error",
    });
    return;
  }

  if (archivosCargados.length + archivos.length > 5) {
    toaster.create({
      description: "Máximo 5 archivos!!",
      type: "error",
    });
    return;
  }

  setSubiendo(true); // ✅ Activa spinner

  try {
    await Promise.allSettled(
      archivos.map(async (archivo) => {
        try {
          await subirArchivoAS3(token, archivo);

          const actualizarArchivos = async () => {
            const res = await fetch(`/api/estudios/${token}`);
            const data = await res.json();
            setArchivosCargados(data?.solicitud?.archivos ?? []);
          };

          await actualizarArchivos();
        } catch (e) {
          console.error("Error al subir o registrar:", archivo.name, e);
        }
      })
    );

    toaster.create({
      description: "Archivos subidos correctamente",
      type: "success",
    });
    setArchivos([]); // ✅ Limpia la lista de archivos locales
  } catch (e) {
    console.error(e);
    toaster.create({
      description: "Error al subir archivos",
      type: "error",
    });
  } finally {
    setSubiendo(false); // ✅ Desactiva spinner
  }
}}
                      >
                        Subir archivo
                      </Button>
                    </>
                  )}
                </FileUpload.Root>
              )}
            </Box>
            {archivosCargados.length > 0 && (
              <Box bg="tema.intenso" p={4} mt={6} borderRadius="xl">
                <Heading size="xl" mb={4} color="tema.claro">
                  Archivos subidos
                </Heading>

                <VStack align="start" gap={4}>
                  {archivosCargados.map((archivo) => (
                    <Box
                      key={archivo.id}
                      p={3}
                      w="full"
                      borderWidth="1px"
                      borderRadius="xl"
                      bg="gray.50"
                    >
                      <HStack justify="space-between">
                        <VStack align="start" gap={0}>
                          <Text fontWeight="bold" color="tema.intenso">
                            {archivo.nombre}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {archivo.tipo} · Subido el{" "}
                            {new Date(archivo.fechaSubida).toLocaleDateString(
                              "es-MX"
                            )}
                          </Text>
                        </VStack>

                        <HStack gap={2}>
                          <Button
                            bg="tema.llamativo"
                            color="tema.claro"
                            size="sm"
                            // variant="outline"
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `/api/estudios/${token}/archivo/${archivo.id}/url`
                                );
                                if (!res.ok)
                                  throw new Error(
                                    "No se pudo obtener la URL del archivo"
                                  );
                                const { url } = await res.json();
                                window.open(url, "_blank");
                              } catch (e) {
                                console.error("Error al abrir archivo:", e);
                                toaster.create({
                                  description: "No se pudo abrir el archivo",
                                  type: "error",
                                });
                              }
                            }}
                          >
                            Ver
                          </Button>

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
                                if (!res.ok)
                                  throw new Error("Error al borrar archivo");

                                // Actualizar archivos en estado
                                setArchivosCargados((prev) =>
                                  prev.filter((a) => a.id !== archivo.id)
                                );

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
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </FondoConBotones>
  );
}
