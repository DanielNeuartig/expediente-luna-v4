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
  Icon,
} from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosTituloInput } from "../config/estilosTituloInput";
import { formatoDatetimeLocal } from "./utils"; // ⬅️ Usa el mismo util que en ListaMedicamentos
import { Star } from "lucide-react";
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
              <Field.Label minW="100px" {...estilosTituloInput} fontSize="2xs">
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
                  size="2xs"
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
              <Field.Label minW="100px" {...estilosTituloInput} fontSize="2xs">
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
                  size="2xs"
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
            <Field.Label minW="100px" {...estilosTituloInput} fontSize="2xs">
              Observaciones clínicas
            </Field.Label>
            <Textarea
              size="xs"
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
              <Field.Label minW="100px" {...estilosTituloInput} fontSize="2xs">
                Fecha de toma de muestra
              </Field.Label>
              <Input
                type="datetime-local"
                size="2xs"
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

      <Button
        {...estilosBotonEspecial}
        onClick={() =>
          append({
            estudio: "",
            proveedor: "",
            observacionesClinica: "",
            fechaTomaDeMuestra: formatoDatetimeLocal(new Date()),
          } as Solicitud)
        }
        type="button"
        mb={2}
      >
        <HStack gap="2">
          <span>Añadir solicitud laboratorial</span>
          <Box
            as="span"
            px="2"
            py="0.5"
            fontSize="xs"
            fontWeight="bold"
            bg="tema.llamativo"
            color="white"
            borderRadius="full"
          >
            <Icon as={Star} boxSize={4} /> new
          </Box>
        </HStack>
      </Button>
    </>
  );
}
