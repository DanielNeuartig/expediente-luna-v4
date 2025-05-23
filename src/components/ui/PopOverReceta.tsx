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

type DatosMascota = {
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  sexo: string;
  esterilizado: string;
};

interface Props {
  medicamentos: Medicamento[];
  datosClinicos?: DatosClinicos;
  datosMascota: DatosMascota;
  fechaNota: string;
  estadoNota: "EN_REVISION" | "FINALIZADA" | "ANULADA"; // ✅ aquí también
  
}

export default function PopOverReceta({
  medicamentos,
  datosClinicos,
  datosMascota,
  fechaNota,
  estadoNota, // ✅ aquí faltaba
}: Props) {
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [incluirDatosClinicos, setIncluirDatosClinicos] = useState(false);

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
        datosMascota={datosMascota}
        fechaNota={fechaNota}
        estadoNota={estadoNota} // ✅
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

              <Button
                onClick={abrirPDF}
                mt="4"
                size="sm"
                colorScheme="teal"
                disabled={seleccionados.length === 0 && !incluirDatosClinicos}
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