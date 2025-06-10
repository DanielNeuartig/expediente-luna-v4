"use client";

import { Box, Button } from "@chakra-ui/react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
//import MedicamentoItemActual from "./MedicamentoItemActual";
import MedicamentoItemNatural from "./MedicamentoItemNatural";
import { Plus, Pill } from "lucide-react";
//import { generarKitDermatitis } from "@/data/combosMedicamentos";
type Props = {
  fechaBase: string;
};

type Medicamento = NonNullable<NotaClinicaValues["medicamentos"]>[number] & {
  modo?: "clasico" | "natural";
};

export default function ListaMedicamentos({ fechaBase }: Props) {
  const { control, setValue, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicamentos",
  });

  const valores = useWatch({ control, name: "medicamentos" }) ?? [];
  const prevValoresStr = useRef("");

  useEffect(() => {
    const currentStr = JSON.stringify(valores);
    if (currentStr === prevValoresStr.current) return;
    prevValoresStr.current = currentStr;
  }, [valores, setValue]);

  return (
    <>
      {fields.map((field, index) => {
        const item = valores[index] as Medicamento | undefined;
        //const modo = item?.modo ?? "clasico";

        return (
          <Box key={field.id} mb={1}>
           {/*{modo === "clasico" ? (
              <MedicamentoItemActual
                index={index}
                item={item}
                control={control}
                register={register}
                setValue={setValue}
                remove={remove}
                fechaBase={fechaBase}
              />
            ) : (*/}
              <MedicamentoItemNatural
                index={index}
                item={item}
                control={control}
                register={register}
                setValue={setValue}
                remove={remove}
                fechaBase={fechaBase}
              />
            {/*})}*/}
          </Box>
        );
      })}

      <Box mt={1}>
        {/*<Button
          {...estilosBotonEspecial}
          onClick={() =>
            append({
              nombre: "",
              dosis: "",
              via: "ORAL",
              tiempoIndefinido: "false",
              frecuenciaHoras: undefined,
              veces: undefined,
              desde: new Date(),
              modo: "clasico",
            } as Medicamento)
          }
          type="button"
          mb={2}
          mr={2}
        >
          Añadir medicamento clásico
        </Button>*/}

        <Button
          fontSize={"lg"}
          {...estilosBotonEspecial}
          type="button"
          mb={1}
          fontWeight={"bold"}
          onClick={() =>
            append({
              nombre: "",
              dosis: "",
              via: "ORAL",
              tiempoIndefinido: "false",
              frecuenciaHoras: undefined,
              veces: undefined,
              desde: new Date(),
              modo: "natural",
            } as Medicamento)
          }
          borderColor="tema.llamativo"
          borderWidth={"5px"}
          borderRadius={"xl"}
        >
          <Plus />
          <Pill />
          Medicamento
        </Button>
        {/*
        <Button
          fontSize="sm"
          {...estilosBotonEspecial}
          onClick={() => append(generarKitDermatitis())}
          mb={1}
          borderRadius="xl"
        >
          <Pill />
          Kit dermatitis (escalonado)
        </Button>*/}








        
      </Box>
    </>
  );
}
