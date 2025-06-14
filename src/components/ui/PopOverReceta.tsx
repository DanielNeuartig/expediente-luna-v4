"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverPositioner,
  PopoverContent,
  PopoverBody,
  PopoverTitle,
  Portal,
  Button,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import RecetaPDF from "@/components/pdf/RecetaPDF";
import { estilosBotonEspecial } from "./config/estilosBotonEspecial";
import type { Mascota } from "@/types/mascota";

type Medicamento = {
  id: number;
  nombre: string;
  dosis: string;
  via: string;
  observaciones?: string | null;
};

type DatosClinicos = {
  historiaClinica?: string;
  exploracionFisica?: string;
  temperatura?: number;
  peso?: number;
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;
  diagnosticoPresuntivo?: string;
  pronostico?: string;
  laboratoriales?: string;
  extras?: string;
};

interface Props {
  medicamentos: Medicamento[];
  datosClinicos?: DatosClinicos;
  datosMascota: Mascota; // ✅ usa el tipo global
  fechaNota: string;
  estadoNota: "EN_REVISION" | "FINALIZADA" | "ANULADA";
  indicaciones?: { descripcion: string }[];
}

export default function PopOverReceta({
  medicamentos,
  datosClinicos,
  datosMascota,
  fechaNota,
  estadoNota,
  indicaciones,
}: Props) {
  const [seleccionados, setSeleccionados] = useState<number[]>(
    medicamentos.map((m) => m.id)
  );
  const [incluirDatosClinicos, setIncluirDatosClinicos] = useState(true);
  const [incluirIndicaciones, setIncluirIndicaciones] = useState(true); // ✅

  const toggleSeleccion = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const abrirPDF = async () => {
    const medsSeleccionados = medicamentos.filter((m) =>
      seleccionados.includes(m.id)
    );

    const blob = await pdf(
      <RecetaPDF
        medicamentos={medsSeleccionados}
        datosClinicos={incluirDatosClinicos ? datosClinicos : undefined}
        datosMascota={{
          ...datosMascota,
          raza:
            datosMascota.raza && typeof datosMascota.raza === "object"
              ? datosMascota.raza
              : datosMascota.raza
              ? { nombre: datosMascota.raza }
              : undefined,
        }}
        fechaNota={fechaNota}
        estadoNota={estadoNota}
        indicaciones={incluirIndicaciones ? indicaciones : undefined} // ✅
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <Popover.Root>
      <PopoverTrigger asChild>
        <Button size="xs" {...estilosBotonEspecial}>
          Generar receta
        </Button>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent>
            <PopoverBody>
              <PopoverTitle fontWeight="semibold" mb="2">
                Selecciona medicamentos
              </PopoverTitle>

              <Stack gap="2">
                {medicamentos.map((m) => (
                  <Checkbox.Root
                    key={m.id}
                    checked={seleccionados.includes(m.id)}
                    onCheckedChange={() => toggleSeleccion(m.id)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>
                      {m.nombre} ({m.dosis}) · {m.via}
                    </Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </Stack>

              <Checkbox.Root
                checked={incluirDatosClinicos}
                onCheckedChange={() => setIncluirDatosClinicos((v) => !v)}
                mt="4"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  Incluir datos clínicos en la receta
                </Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                checked={incluirIndicaciones}
                onCheckedChange={() => setIncluirIndicaciones((v) => !v)}
                mt="2"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  Incluir INDICACIONES en la receta
                </Checkbox.Label>
              </Checkbox.Root>

              <Button
                onClick={abrirPDF}
                mt="4"
                size="sm"
                colorScheme="teal"
                disabled={
                  seleccionados.length === 0 &&
                  !incluirDatosClinicos &&
                  !incluirIndicaciones
                }
              >
                Ver receta en PDF
              </Button>
            </PopoverBody>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </Popover.Root>
  );
}
