"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  Input,
  Textarea,
  Wrap,
  WrapItem,
  Badge,
} from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosTituloInput } from "../config/estilosTituloInput";
import { formatoDatetimeLocal } from "./utils"; // ⬅️ Usa el mismo util que en ListaMedicamentos
import { Star, Microscope, Plus } from "lucide-react";
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
          borderWidth="2px"
          p="4"
          rounded="md"
          borderColor="tema.morado"
          bg="purple.50"
        >
          <Fieldset.Legend {...estilosTituloInput}>
            Solicitud #{index + 1}
          </Fieldset.Legend>

          {/* Estudio */}
          <Field.Root>
            <HStack align="start">
              <Field.Label minW="100px" {...estilosTituloInput} fontSize="sm">
                Estudio solicitado
              </Field.Label>
              <Textarea
                size="sm"
                {...estilosInputBase}
                {...register(`solicitudesLaboratoriales.${index}.estudio`)}
              />
            </HStack>
          </Field.Root>

          <Wrap mt="2" mb="4">
            {[
              "BH",
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
              <Field.Label minW="100px" {...estilosTituloInput} fontSize="sm">
                Proveedor
              </Field.Label>
              <Textarea
                size="sm"
                {...estilosInputBase}
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
            <Field.Label minW="100px" {...estilosTituloInput} fontSize="sm">
              Observaciones clínicas
            </Field.Label>
            <Textarea
              size="sm"
              placeholder="Detalles clínicos relevantes para el estudio"
              {...estilosInputBase}
              {...register(
                `solicitudesLaboratoriales.${index}.observacionesClinica`
              )}
            />
          </Field.Root>

          {/* Fecha de toma de muestra */}
          <Field.Root>
            <HStack align="start">
              <Field.Label minW="100px" {...estilosTituloInput} fontSize="sm">
                Fecha de toma de muestra
              </Field.Label>
              <Input
                type="datetime-local"
                size="sm"
                defaultValue={formatoDatetimeLocal(new Date())}
                {...estilosInputBase}
                {...register(
                  `solicitudesLaboratoriales.${index}.fechaTomaDeMuestra`
                )}
              />
            </HStack>
          </Field.Root>

          {/* Botón eliminar */}
          <Button
            variant="ghost"
            color="red.500"
            size="sm"
            mt={3}
            onClick={() => remove(index)}
          >
            Eliminar solicitud
          </Button>
        </Box>
      ))}
      <HStack>
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
        <Button
          color="tema.claro"
          bg="tema.suave"
          onClick={() =>
            append({
              estudio: "BH",
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
    </>
  );
}
