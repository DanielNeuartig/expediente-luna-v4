"use client";

import {
  Box,
  Button,
  Field,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";

import { estilosTituloInput } from "../config/estilosTituloInput";
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";
import { Plus, Bone } from "lucide-react";
import { useWatch } from "react-hook-form";
import { X } from "lucide-react";
type Indicacion = NonNullable<NotaClinicaValues["indicaciones"]>[number];
export const estilosInput = {
  color: "gray.600",
  borderColor: "gray.200",
  borderRadius: "2xl",
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
const indicacionesPredefinidas = [
  {
    nombre: "Indicaciones parásitos",
    texto: `Los parásitos pueden ser altamente contagiosos tanto para mascotas como humanos, debido a esto es necesario seguir las siguientes indicaciones:
    -limpiar las heces de la mascota inmediatamente después de que haga del baño y lavar el suelo con cloro. 
    -No permitir que la mascota esté en contacto con fómites, es decir, que no esté en contacto con sillas, sofás, camas, textiles, etc. 
    -Lavar textiles como sábanas antes de comenzar el tratamiento y no permitir a la mascota estar en contacto con ellas. Esto debido a que los parásitos se pueden almacenar fácilmente ahí y producir otro contagio. 
    -Después de que la mascota defeque: limpiar la zona perianal con una toallita húmeda; de ser complicado hacerlo cada que defeque: hacerlo tres vece sal día. 
    -Bañar a la mascota cada 5 días ó al terminar el tratamiento de desparasitantes.`,
  },
  {
    nombre: "Indicaciones postcx",
    texto: `-No permitir a la mascota hacer esfuerzos, es decir: no sacar a pasear, no dejar subir escaleras, no permitir brincar al sofá, cama u otro objeto. 
    -Dejar a la mascota lo más relajada posible, no estresarla. 
    -Usar collar isabelino durante al menos 10 días. 
    -Lavar la herida cada 12 horas con antiséptico y gasas estériles. 
    -En caso de que la herida supure contenido blanquecino, verdoso ó con mal olor, acudir a clínica. 
    -En caso de que la herida se abra, acudir a clínica. 
    -No permitir que la mascota se lama ó rasque la herida, ni que alguna otra mascota con la que conviva le manipule la herida.`,
  },
  {
    nombre: "Indicaciones de buenos hábitos",
    texto: `-Dar únicamente agua del garrafón. 
    -Dar del 80 al 100% de la dieta como croquetas de calidad premium ó superior (no croquetas comerciales). En cuanto a la porción de la croqueta, dividirla en 2 raciones: para mañana y noche. 
    -Todas las croquetas tienen al reverso una tabla de raciones: dar únicamente lo que esa tabla indique (no das más porción que esa, dividida en dos raciones).`,
  },
];

export default function ListaIndicaciones() {
  const { control, register, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "indicaciones",
  });
  const descripciones = useWatch({
    control,
    name: "indicaciones",
  });

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
          borderColor="green.600"
          bg="green.50"
        >
          {/*
          <Fieldset.Legend {...estilosTituloInput}>
            Indicación #{index + 1}
          </Fieldset.Legend>*/}

          <Field.Root>
            <Field.Label {...estilosTituloInput}>Indicación</Field.Label>
            <Textarea
              {...estilosInput}
              {...register(`indicaciones.${index}.descripcion`)}
            />
          </Field.Root>

          <Wrap mt="3" mb="3">
            {indicacionesPredefinidas.map((item, i) => {
              const valorActual = descripciones?.[index]?.descripcion?.trim();
              const esSeleccionado = valorActual === item.texto;

              return (
                <WrapItem key={i}>
                  <Button
                    size="sm"
                    bg={esSeleccionado ? "tema.llamativo" : "tema.suave"}
                    color="tema.claro"
                    _hover={{ bg: "tema.llamativo" }}
                    onClick={() =>
                      setValue(
                        `indicaciones.${index}.descripcion`,
                        item.texto,
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      )
                    }
                  >
                    {item.nombre}
                  </Button>
                </WrapItem>
              );
            })}
          </Wrap>

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

      <Button
        borderColor="tema.llamativo"
        borderWidth={"5px"}
        borderRadius={"xl"}
        fontSize={"lg"}
        {...estilosBotonEspecial}
        type="button"
        mb={2}
        fontWeight={"bold"}
        onClick={() =>
          append({

            descripcion: "",
          } as Indicacion)
        }
      >
        <Plus />
        <Bone />
        Indicación
      </Button>
    </>
  );
}
