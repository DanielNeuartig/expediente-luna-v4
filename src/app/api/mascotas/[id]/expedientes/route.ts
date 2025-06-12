// src/app/api/mascotas/[id]/expedientes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const mascotaId = Number(id);

  if (Number.isNaN(mascotaId)) {
    return NextResponse.json(
      { error: "ID de mascota inválido" },
      { status: 400 }
    );
  }

  try {
    const mascotaConPerfil = await prisma.mascota.findUnique({
      where: { id: mascotaId },
      select: {
        perfil: {
          select: {
            id: true,
            nombre: true,
            prefijo: true,
            clave: true,
            telefonoPrincipal: true,
          },
        },
      },
    });

    const expedientes = await prisma.expedienteMedico.findMany({
      where: { mascotaId },
      orderBy: { fechaCreacion: "desc" },
      select: {
        id: true,
        estado: true,
        tipo: true,
        nombre: true,
        contenidoAdaptado: true,
        notasGenerales: true,
        visibleParaTutor: true,
        fechaAlta: true,
        ultimaActividad: true,
        fechaCreacion: true,
        autor: {
          select: {
            id: true,
            nombre: true,
            prefijo: true,
            usuario: {
              select: { image: true },
            },
          },
        },
        notasClinicas: {
          orderBy: { fechaCreacion: "desc" },
          select: {
            id: true,
            historiaClinica: true,
            exploracionFisica: true,
            temperatura: true,
            peso: true,
            frecuenciaCardiaca: true,
            frecuenciaRespiratoria: true,
            diagnosticoPresuntivo: true,
            pronostico: true,
            extras: true,
            archivos: true,
            fechaCreacion: true,
            estado: true,
            fechaCancelacion: true,
            anuladaPor: {
              select: {
                id: true,
                nombre: true,
                prefijo: true,
                usuario: {
                  select: { image: true },
                },
              },
            },
            autor: {
              select: {
                id: true,
                nombre: true,
                prefijo: true,
                usuario: {
                  select: { image: true },
                },
              },
            },
            medicamentos: {
              select: {
                id: true,
                nombre: true,
                dosis: true,
                via: true,
                frecuenciaHoras: true,
                veces: true,
                desde: true,
                observaciones: true,
                paraCasa: true,
                tiempoIndefinido: true,
                aplicaciones: {
                  orderBy: { fechaProgramada: "asc" },
                  select: {
                    id: true,
                    fechaProgramada: true,
                    fechaReal: true,
                    nombreMedicamentoManual: true,
                    dosis: true,
                    via: true,
                    estado: true,
                    observaciones: true,
                    ejecutor: {
                      select: {
                        id: true,
                        nombre: true,
                        prefijo: true,
                        usuario: {
                          select: { image: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            indicaciones: {
              select: {
                id: true,
                descripcion: true,
              },
            },
            solicitudesLaboratoriales: {
              select: {
                id: true,
                estudio: true,
                proveedor: true,
                tokenAcceso: true,
                estado: true,
                observacionesClinica: true,
                fechaSolicitud: true,
                fechaTomaDeMuestra: true,
                archivos: {
                  select: {
                    id: true,
                    url: true,
                    nombre: true,
                    tipo: true,
                    fechaSubida: true,
                  },
                },
              },
            },
            laboratoriales: {
              orderBy: { fechaCreacion: "desc" },
              select: {
                id: true,
                fechaToma: true,
                fechaCreacion: true,
                tipoEstudio: {
                  select: { nombre: true },
                },
                solicitudLaboratorial: {
                  select: {
                    fechaSolicitud: true,
                    estudio: true, // 👈 Añade esto
                    estado: true,
                    id: true,
                    proveedor: true,
                    archivos: {
                      select: {
                        id: true,
                        url: true,
                        nombre: true,
                        tipo: true,
                        fechaSubida: true,
                      },
                    },
                  },
                },
                resultados: {
                  select: {
                    id: true,
                    nombreManual: true,
                    valorNumerico: true,
                    valorTexto: true,
                    observaciones: true,
                    analito: {
                      select: {
                        nombre: true,
                        unidad: true,
                        valoresReferencia: {
                          select: {
                            especie: true, // ✅ importante
                            minimo: true,
                            maximo: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      expedientes,
      perfil: mascotaConPerfil?.perfil ?? null,
    });
  } catch (error) {
    console.error("💥 Error al obtener expedientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
