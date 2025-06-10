"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  VStack,
  Input,
  Textarea,
  Wrap,
  WrapItem,
  Badge,
} from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { formatoDatetimeLocal } from "./utils"; // ⬅️ Usa el mismo util que en ListaMedicamentos
import { Star, Microscope, Plus} from "lucide-react";
import { X } from "lucide-react";

export const estilosInput = {
  color: "gray.600",
  borderColor: "gray.200",
  borderRadius: "xl",
  bg: "white",
  _placeholder: {
    color: "gray.300",
  },
  _focus: {
    boxShadow: "none",
    border: "none",
    outline: "4px solid",
    outlineColor: "tema.llamativo", // 🎨 token del tema Chakra
  },
};

export const estilosTitulo = {
  color: "gray.600",
  fontWeight: "md",
};

type Solicitud = {
  estudio: string;
  proveedor: string;
  observacionesClinica?: string;
  fechaTomaDeMuestra?: string;
};

export default function ListasolicitudesLaboratoriales() {
  const { control, register, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "solicitudesLaboratoriales",
  });

  //const solicitudes = useWatch({ control, name: "solicitudesLaboratoriales" }) ?? [];

  return (
    <>
      {fields.map((field, index) => (
        <Box
          key={field.id}
          position="relative" // 🟡 Añade esto
          borderWidth="2px"
          p="2"
          px="5"
          borderRadius="4xl"
          borderColor="tema.morado"
          bg="purple.50"
        >
          <Fieldset.Legend {...estilosTitulo}>
            Solicitud #{index + 1}
          </Fieldset.Legend>

          {/* Estudio */}
          <Field.Root>
            <HStack align="start">
              <Field.Label minW="100px" {...estilosTitulo} fontSize="sm">
                Estudio solicitado
              </Field.Label>
              <Textarea
                size="sm"
                {...estilosInput}
                {...register(`solicitudesLaboratoriales.${index}.estudio`, {
                  onBlur: (e) => {
                    const valor = e.target.value.trim().toUpperCase();
                    if (valor === "BH") {
                      setValue(
                        `solicitudesLaboratoriales.${index}.estudio`,
                        "Biometria Hematica",
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      );
                    }
                  },
                })}
              />
            </HStack>
          </Field.Root>

          <Wrap mt="2" mb="4">
            {[
              "Biometria Hematica",
              "Química simple",
              "Química completa",
              "EGO",
              "Raspado cutáneo",
            ].map((texto) => (
              <WrapItem key={texto}>
                <Button
                  size="sm"
                  bg="tema.suave"
                  color="tema.claro"
                  _hover={{ bg: "tema.llamativo" }}
                  onClick={() =>
                    setValue(
                      `solicitudesLaboratoriales.${index}.estudio`,
                      texto,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      }
                    )
                  }
                >
                  {texto}
                </Button>
              </WrapItem>
            ))}
          </Wrap>

          {/* Proveedor */}
          <Field.Root>
            <HStack align="start">
              <Field.Label minW="100px" {...estilosInput} fontSize="sm">
                Proveedor
              </Field.Label>
              <Textarea
                size="sm"
                {...estilosInput}
                {...register(`solicitudesLaboratoriales.${index}.proveedor`)}
              />
            </HStack>
          </Field.Root>

          <Wrap mt="2" mb="4">
            {[
              "ELDOC",
              "Labpet",
              "Parasitología SPP",
              "Hospital Veterinario del Valle Av. Munguia 2208, Lomas de Atemajac, 45178 Zapopan, Jal. - 33 38 54 67 26",
            ].map((texto) => (
              <WrapItem key={texto}>
                <Button
                  size="sm"
                  bg="tema.suave"
                  color="tema.claro"
                  _hover={{ bg: "tema.llamativo" }}
                  onClick={() =>
                    setValue(
                      `solicitudesLaboratoriales.${index}.proveedor`,
                      texto,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      }
                    )
                  }
                >
                  {texto}
                </Button>
              </WrapItem>
            ))}
          </Wrap>

          {/* Observaciones clínicas */}
          <Field.Root>
            <Field.Label minW="100px" {...estilosTitulo} fontSize="sm">
              Observaciones clínicas
            </Field.Label>
            <Textarea
              size="sm"
              placeholder="Detalles clínicos relevantes para el estudio"
              {...estilosInput}
              {...register(
                `solicitudesLaboratoriales.${index}.observacionesClinica`
              )}
            />
          </Field.Root>

          {/* Fecha de toma de muestra */}
          <Field.Root>
            <HStack align="start">
              <Field.Label minW="100px" {...estilosTitulo} fontSize="sm">
                Fecha de toma de muestra
              </Field.Label>
              <Input
                type="datetime-local"
                size="sm"
                defaultValue={formatoDatetimeLocal(new Date())}
                {...estilosInput}
                {...register(
                  `solicitudesLaboratoriales.${index}.fechaTomaDeMuestra`
                )}
              />
            </HStack>
          </Field.Root>

          {/* Botón eliminar */}
          <Button
            position="absolute" // 🟡 Posicionamiento absoluto
            top="2" // 🟡 Separación desde arriba
            right="2" // 🟡 Separación desde la derecha
            variant="ghost"
            color="tema.rojo"
            size="xs"
            onClick={() => remove(index)}
          >
            <X />
          </Button>
        </Box>
      ))}
      <VStack>
        <Button
          fontSize={"lg"}
          {...estilosBotonEspecial}
          type="button"
          mb={2}
          fontWeight={"bold"}
          borderColor="tema.llamativo"
          borderWidth={"5px"}
          borderRadius={"xl"}
          onClick={() =>
            append({
              estudio: "",
              proveedor: "",
              observacionesClinica: "",
              fechaTomaDeMuestra: formatoDatetimeLocal(new Date()),
            } as Solicitud)
          }
        >
          <HStack gap="2">
            <Plus />
            <Microscope size={32} />
            Laboratorial
            <Badge
              variant="solid"
              bg="tema.llamativo"
              color="tema.claro"
              animation="floatGlow"
            >
              <Star />
              New
            </Badge>
          </HStack>
        </Button>
        <HStack>
          <Button
            color="tema.claro"
            bg="tema.suave"
            onClick={() =>
              append({
                estudio: "Biometria Hematica",
                proveedor: "ELDOC",
                observacionesClinica: "",
                fechaTomaDeMuestra: formatoDatetimeLocal(new Date()),
              } as Solicitud)
            }
            _hover={{ bg: "tema.llamativo" }}
            type="button"
            mb={2}
            borderRadius={"2xl"}
            fontWeight={"bold"}
            animation="floatGlow"
          >
            <HStack gap="1">
              <Badge bg="tema.rojo" borderRadius="xl" p="1" px="2">
                BH
              </Badge>
              <Badge bg="tema.llamativo" borderRadius="xl" p="1" px="2">
                ELDOC
              </Badge>
            </HStack>
          </Button>
          <Button
            color="tema.claro"
            bg="tema.suave"
            onClick={() =>
              append({
                estudio: "Química simple",
                proveedor: "LABPET",
                observacionesClinica: "",
                fechaTomaDeMuestra: formatoDatetimeLocal(new Date()),
              } as Solicitud)
            }
            _hover={{ bg: "tema.llamativo" }}
            type="button"
            mb={2}
            borderRadius={"2xl"}
            fontWeight={"bold"}
            animation="floatGlow"
          >
            <HStack gap="1">
              <Badge bg="tema.verde" borderRadius="xl" p="1" px="2">
                Q. S.
              </Badge>
              <Badge bg="tema.morado" borderRadius="xl" p="1" px="2">
                LABPET
              </Badge>
            </HStack>
          </Button>

          <Button
            color="tema.claro"
            bg="tema.suave"
            onClick={() =>
              append({
                estudio: "Química completa",
                proveedor: "LABPET",
                observacionesClinica: "",
                fechaTomaDeMuestra: formatoDatetimeLocal(new Date()),
              } as Solicitud)
            }
            _hover={{ bg: "tema.llamativo" }}
            type="button"
            mb={2}
            borderRadius={"2xl"}
            fontWeight={"bold"}
            animation="floatGlow"
          >
            <HStack gap="1">
              <Badge bg="tema.verde" borderRadius="xl" p="1" px="2">
                Q. C.
              </Badge>
              <Badge bg="tema.morado" borderRadius="xl" p="1" px="2">
                LABPET
              </Badge>
            </HStack>
          </Button>

          <Button
            color="tema.claro"
            bg="tema.suave"
            onClick={() =>
              append({
                estudio: "Coproparasitoscópico seriado",
                proveedor: "Parasitología SPP",
                observacionesClinica: "",
                fechaTomaDeMuestra: formatoDatetimeLocal(new Date()),
              } as Solicitud)
            }
            _hover={{ bg: "tema.llamativo" }}
            type="button"
            mb={2}
            borderRadius={"2xl"}
            fontWeight={"bold"}
            animation="floatGlow"
          >
            <HStack gap="1">
              <Badge bg="tema.naranja" borderRadius="xl" p="1" px="2">
                Copro S.
              </Badge>
              <Badge bg="tema.naranja" borderRadius="xl" p="1" px="2">
                SPP
              </Badge>
            </HStack>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
