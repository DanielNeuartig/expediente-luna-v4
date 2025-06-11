"use client";

import {
  Box,
  Icon,
  Text,
  HStack,
  Stack,
  Spinner,
  Heading,
  VStack,
  Badge,
  Button,
  Input,
  Image,
} from "@chakra-ui/react";

import {
  ClipboardSignature,
  FlaskConical,
  Building2,
  StickyNote,
  CalendarClock,
} from "lucide-react";
import { useState, useEffect } from "react";
import FondoSinBotones from "@/components/ui/fondos/FondoSinBotones";
import BoxMascota from "@/components/ui/BoxMascota";
import { useParams } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import type { ResultadoMascota } from "@/components/ui/BoxMascota";
import { estilosBotonEspecial } from "@/components/ui/config/estilosBotonEspecial";
import { estilosInputBase } from "@/components/ui/config/estilosInputBase";
import ComponenteUploadArchivos from "@/components/ui/subidaDeArchivos/ComponenteUploadArchivos";
import ListaArchivosSubidos from "@/components/ui/subidaDeArchivos/ListaArchivosSubidos";

type ArchivoLaboratorial = {
  id: number;
  url: string;
  nombre: string;
  tipo: string;
  fechaSubida: string;
};

type SolicitudLaboratorialPlano = {
  id: number;
  estudio?: string;
  tipoEstudioId?: number; // ✅ nuevo
  proveedor: string;
  observacionesClinica?: string;
  fechaTomaDeMuestra: string;
};

export default function DemoUploadConBorrado() {
  const [autenticado, setAutenticado] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [subiendo] = useState(false);
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
        console.log(
          "🧬 rawSolicitud.tipoEstudioId:",
          rawSolicitud.tipoEstudioId
        );
        if (rawSolicitud) {
          setSolicitud({
            id: rawSolicitud.id,
            estudio: rawSolicitud.estudio,
            proveedor: rawSolicitud.proveedor,
            observacionesClinica: rawSolicitud.observacionesClinica,
            fechaTomaDeMuestra: rawSolicitud.fechaTomaDeMuestra,
            tipoEstudioId: rawSolicitud.tipoEstudioId,
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
    // Corregido: loguea el estudio de la solicitud cruda

    obtenerDatos();
  }, [token]);

  const verificarCodigo = async () => {
    try {
      const res = await fetch("/api/verificar-codigo", {
        method: "POST",
        body: JSON.stringify({ codigo: codigoIngresado }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAutenticado(true);
        toaster.create({
          description: "Acceso exitoso",
          type: "success",
        });
      } else if (res.status === 429) {
        toaster.create({
          description: `Demasiados intentos. Espera ${data.tiempoRestante} segundos.`,
          type: "error",
        });
      } else if (res.status === 401) {
        if (data.bloqueado) {
          toaster.create({
            description: "Código incorrecto. Has sido bloqueado temporalmente.",
            type: "error",
          });
        } else {
          toaster.create({
            description: `Código incorrecto. Intentos restantes: ${data.intentosRestantes}`,
            type: "warning",
          });
        }
      } else if (res.status === 400) {
        toaster.create({
          description: data.error || "Solicitud malformada",
          type: "error",
        });
      } else {
        toaster.create({
          description: "Error desconocido",
          type: "error",
        });
      }
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "Error inesperado";
      toaster.create({
        description: `Error desconocido: ${mensaje}`,
        type: "error",
      });
    }
  };

  if (!autenticado) {
    return (
      <FondoSinBotones>
        <Stack
          minH="100vh"
          justify="center"
          align="center"
          px={6}
          gap={6}
          animation="fadeInUp"
        >
          <Box
            bg="tema.intenso"
            p="5"
            borderRadius="xl"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={6}
            maxW="sm"
            w="full"
            shadow="lg"
            textAlign="center" // ✅ centra texto
          >
            <Image
              src="/imagenes/LogoBordesReducidos.png"
              alt="Logo"
              w="70%"
              //maxH="80px"
              objectFit="contain"
              borderRadius="xl"
            />
            <Badge bg="tema.llamativo" p="3" borderRadius="xl" mb="3">
              <Text fontSize="xl" fontWeight="bold" color="tema.claro">
                Archivos de laboratorio
              </Text>
            </Badge>

            <Text fontSize="md" fontWeight="medium" color="tema.claro">
              Ingrese código de proveedor
            </Text>

            <Stack w="xs" gap={4} align="center">
              <Input
                {...estilosInputBase}
                type="password"
                placeholder="Código"
                value={codigoIngresado}
                onChange={(e) => setCodigoIngresado(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verificarCodigo();
                }}
              />

              <Button
                {...estilosBotonEspecial}
                onClick={verificarCodigo}
                disabled={!codigoIngresado.trim()} // ✅ desactiva si vacío
              >
                Verificar
              </Button>
            </Stack>
          </Box>
        </Stack>
      </FondoSinBotones>
    );
  }
  return (
    <FondoSinBotones>
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
            <Box>
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
                <Box animation="pulseCloud">
                  <ComponenteUploadArchivos
                    token={token}
                    archivosCargados={archivosCargados.map((a) => ({
                      id: a.id.toString(), // 🔄 forzamos a string
                      url: a.url,
                      nombre: a.nombre,
                    }))}
                    setArchivosCargados={(archivos) => {
                      // Solo permitimos los campos esperados por ArchivoLaboratorial
                      const normalizados: ArchivoLaboratorial[] = archivos.map(
                        (a) => ({
                          id: parseInt(a.id), // 🔄 regresamos a número
                          url: a.url,
                          nombre: a.nombre,
                          tipo: "desconocido", // puedes ajustarlo si tienes más info
                          fechaSubida: new Date().toISOString(), // o puedes omitirlo si no se necesita
                        })
                      );
                      setArchivosCargados(normalizados);
                    }}
                  />
                </Box>
              )}
            </Box>
            {archivosCargados.length > 0 && mascota && (
              <ListaArchivosSubidos
                estudio={solicitud?.estudio}
                mascota={mascota}
                token={token}
                archivos={archivosCargados}
                proveedor={solicitud?.proveedor}
                onActualizar={async () => {
                  const res = await fetch(`/api/estudios/${token}`);
                  const data = await res.json();
                  setArchivosCargados(data?.solicitud?.archivos ?? []);
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </FondoSinBotones>
  );
}
