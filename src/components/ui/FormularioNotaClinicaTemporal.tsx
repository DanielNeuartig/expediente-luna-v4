"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  Input,
  NativeSelect,
  RadioCard,
  Stack,
  Textarea,
  /*SegmentGroup,*/
} from "@chakra-ui/react";
import { useState } from "react";
import { estilosTituloInput } from "./config/estilosTituloInput";
import { estilosInputBase } from "./config/estilosInputBase";
import { estilosBotonEspecial } from "./config/estilosBotonEspecial";
import type { Mascota } from "@/types/mascota";
// Define el tipo para el expediente seleccionado
type Expediente = {
  id: number;
  tipo: string;
  fechaCreacion: string;
};

type Props = {
  expedienteSeleccionado: Expediente | null;
   mascota: Mascota;
};

const formatoDatetimeLocal = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
};

const now = new Date();
const fechaAhora = formatoDatetimeLocal(now);

type MedicamentoHorario = {
  frecuenciaHoras: string;
  veces: string;
  desde: string;
};

export default function FormularioNotaClinicaTemporal({
  expedienteSeleccionado,
}: Props) {
  const [medicamentos, setMedicamentos] = useState<object[]>([]);
  const [indicaciones, setIndicaciones] = useState<object[]>([]);
  const [medHorarios, setMedHorarios] = useState<MedicamentoHorario[]>([]);
  // Si no hay expediente seleccionado, solo mostramos un mensaje amigable
  if (!expedienteSeleccionado) {
    return (
      <Box color="gray.400" fontSize="md">
        Selecciona un expediente para añadir una nota clínica.
      </Box>
    );
  }

  // Estados para medicamentos e indicaciones

  const handleAddMedicamento = () => {
    setMedicamentos((prev) => [...prev, {}]);
    setMedHorarios((prev) => [
      ...prev,
      { frecuenciaHoras: "", veces: "", desde: fechaAhora },
    ]);
  };

  const handleAddIndicacion = () => {
    setIndicaciones((prev) => [...prev, {}]);
  };

  const handleHorarioChange = (
    idx: number,
    campo: keyof MedicamentoHorario,
    valor: string
  ) => {
    setMedHorarios((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, [campo]: valor } : h))
    );
  };

  const calcularFechas = (
    desde: string,
    frecuenciaHoras: string,
    veces: string
  ) => {
    const fechas: string[] = [];
    if (
      desde &&
      frecuenciaHoras &&
      veces &&
      !isNaN(Number(frecuenciaHoras)) &&
      !isNaN(Number(veces))
    ) {
      const base = new Date(desde);
      for (let i = 0; i < Number(veces); i++) {
        const fecha = new Date(base);
        fecha.setHours(fecha.getHours() + i * Number(frecuenciaHoras));
        fechas.push(
          fecha.toLocaleString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    }
    return fechas;
  };

  type NestedFormValue = string | number | boolean;
  type NestedFormObject = Record<string, NestedFormValue>;
  type NestedFormData = Record<string, NestedFormValue | NestedFormObject[]>;

  const parseNestedFormData = (
    data: Record<string, FormDataEntryValue>
  ): NestedFormData => {
    const result: NestedFormData = {};

    for (const [key, value] of Object.entries(data)) {
      const match = key.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
      if (match) {
        const [, arrayName, indexStr, propName] = match;
        const index = Number(indexStr);

        if (!Array.isArray(result[arrayName])) {
          result[arrayName] = [];
        }

        const array = result[arrayName] as NestedFormObject[];
        if (!array[index]) {
          array[index] = {};
        }

        array[index][propName] = value.toString();
      } else {
        result[key] = value.toString();
      }
    }

    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const raw = Object.fromEntries(formData.entries());
    const data = parseNestedFormData(raw);

    // Incluye el id del expediente asociado en la nota clínica
    const notaConExpediente = {
      ...data,
      expedienteId: expedienteSeleccionado.id,
    };

    console.log("🧾 Nota clínica enviada:", notaConExpediente);
    // Aquí va tu lógica para guardar la nota clínica con el backend/mutación
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root size="lg" width="full">
        <Stack>
          <Fieldset.Legend color="tema.intenso">Nota clínica</Fieldset.Legend>
          <Fieldset.HelperText>
            Registrando en expediente #{expedienteSeleccionado.id} ·{" "}
            {expedienteSeleccionado.tipo}
          </Fieldset.HelperText>
        </Stack>
        <Fieldset.Content>
          <HStack>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>
                Historia clínica
              </Field.Label>
              <Textarea
                {...estilosInputBase}
                color="tema.suave"
                name="historiaClinica"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>
                Exploración física
              </Field.Label>
              <Textarea {...estilosInputBase} name="exploracionFisica" />
            </Field.Root>
          </HStack>
          <HStack>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>
                Temperatura (°C)
              </Field.Label>
              <Input
                {...estilosInputBase}
                name="temperatura"
                type="number"
                step="0.1"
                defaultValue={"37.5"}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>Peso (kg)</Field.Label>
              <Input
                {...estilosInputBase}
                name="peso"
                type="number"
                step="0.01"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>FC</Field.Label>
              <Input
                {...estilosInputBase}
                name="frecuenciaCardiaca"
                type="number"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>FR</Field.Label>
              <Input
                {...estilosInputBase}
                name="frecuenciaRespiratoria"
                type="number"
              />
            </Field.Root>
          </HStack>
          <HStack>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>
                Diagnóstico presuntivo
              </Field.Label>
              <Textarea {...estilosInputBase} name="diagnosticoPresuntivo" />
            </Field.Root>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>Pronóstico</Field.Label>
              <Textarea {...estilosInputBase} name="pronostico" />
            </Field.Root>
          </HStack>
          <HStack>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>Laboratoriales</Field.Label>
              <Textarea {...estilosInputBase} name="laboratoriales" />
            </Field.Root>
            <Field.Root>
              <Field.Label {...estilosTituloInput}>Extras</Field.Label>
              <Textarea {...estilosInputBase} name="extras" />
            </Field.Root>
          </HStack>

          {/* Medicamentos dinámicos (si hay alguno) */}
          {medicamentos.map((_, index) => (
            <Box key={index} borderWidth="1px" p="4" rounded="md">
              <Fieldset.Legend {...estilosTituloInput}>
                Medicamento #{index + 1}
              </Fieldset.Legend>
              <HStack>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Nombre</Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`medicamentos[${index}].nombre`}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Dosis</Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`medicamentos[${index}].dosis`}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Vía</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      {...estilosInputBase}
                      name={`medicamentos[${index}].via`}
                    >
                      <option value="ORAL">Oral</option>
                      <option value="SC">SC</option>
                      <option value="IM">IM</option>
                      <option value="IV">IV</option>
                      <option value="OTICA">Ótica</option>
                      <option value="OFTALMICA">Oftálmica</option>
                      <option value="TOPICA">Tópica</option>
                      <option value="OTRO">Otro</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
              </HStack>

              <HStack>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>
                    Cada cuántas horas
                  </Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`medicamentos[${index}].frecuenciaHoras`}
                    type="number"
                    value={medHorarios[index]?.frecuenciaHoras || ""}
                    onChange={(e) =>
                      handleHorarioChange(
                        index,
                        "frecuenciaHoras",
                        e.target.value
                      )
                    }
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Veces</Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`medicamentos[${index}].veces`}
                    type="number"
                    value={medHorarios[index]?.veces || ""}
                    onChange={(e) =>
                      handleHorarioChange(index, "veces", e.target.value)
                    }
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Desde</Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`medicamentos[${index}].desde`}
                    type="datetime-local"
                    value={medHorarios[index]?.desde || fechaAhora}
                    onChange={(e) =>
                      handleHorarioChange(index, "desde", e.target.value)
                    }
                  />
                </Field.Root>
              </HStack>

              {/* Fechas calculadas de aplicación */}
              <Stack gap={0} mb={2} mt={-2}>
                {calcularFechas(
                  medHorarios[index]?.desde,
                  medHorarios[index]?.frecuenciaHoras,
                  medHorarios[index]?.veces
                ).map((fecha, i) => (
                  <Box key={i} color="#00ADB5" fontSize="sm">
                    {`Aplicación #${i + 1}: ${fecha}`}
                  </Box>
                ))}
              </Stack>

              <Field.Root>
                <Field.Label {...estilosTituloInput}>Observaciones</Field.Label>
                <Textarea
                  {...estilosInputBase}
                  name={`medicamentos[${index}].observaciones`}
                  placeholder="Observaciones sobre el medicamento"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label {...estilosTituloInput}>
                  ¿Para casa?
                </Field.Label>
                <RadioCard.Root
                  {...estilosInputBase}
                  name={`medicamentos[${index}].paraCasa`}
                  defaultValue="false"
                >
                  <HStack>
                    <RadioCard.Item value="true">
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl />
                      <RadioCard.ItemText>Sí</RadioCard.ItemText>
                      <RadioCard.ItemIndicator />
                    </RadioCard.Item>
                    <RadioCard.Item value="false">
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl />
                      <RadioCard.ItemText>No</RadioCard.ItemText>
                      <RadioCard.ItemIndicator />
                    </RadioCard.Item>
                  </HStack>
                </RadioCard.Root>
              </Field.Root>
            </Box>
          ))}

          <Button
            {...estilosBotonEspecial}
            onClick={handleAddMedicamento}
            type="button"
            mb={2}
          >
            Añadir medicamento
          </Button>

          {/* Indicaciones dinámicas */}
          {indicaciones.map((_, index) => (
            <Box key={index} borderWidth="1px" p="4" rounded="md">
              <Fieldset.Legend color="tema.intenso">
                Indicación #{index + 1}
              </Fieldset.Legend>

              <Field.Root>
                <Field.Label {...estilosTituloInput}>Descripción</Field.Label>
                <Textarea
                  {...estilosInputBase}
                  name={`indicaciones[${index}].descripcion`}
                />
              </Field.Root>
              <HStack>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>
                    Cada cuántas horas
                  </Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`indicaciones[${index}].frecuenciaHoras`}
                    type="number"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Veces</Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`indicaciones[${index}].veces`}
                    type="number"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Desde</Field.Label>
                  <Input
                    {...estilosInputBase}
                    name={`indicaciones[${index}].desde`}
                    type="datetime-local"
                    defaultValue={fechaAhora}
                  />
                </Field.Root>
              </HStack>
              <Field.Root>
                <Field.Label {...estilosTituloInput}>Observaciones</Field.Label>
                <Textarea
                  {...estilosInputBase}
                  name={`indicaciones[${index}].observaciones`}
                  placeholder="Observaciones sobre la indicación"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label {...estilosTituloInput}>
                   ¿Para casa?
                </Field.Label>
                <RadioCard.Root
                  {...estilosInputBase}
                  name={`indicaciones[${index}].paraCasa`}
                  defaultValue="false"
                >
                  <HStack>
                    <RadioCard.Item value="true">
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl />
                      <RadioCard.ItemText>Sí</RadioCard.ItemText>
                      <RadioCard.ItemIndicator />
                    </RadioCard.Item>
                    <RadioCard.Item value="false">
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl />
                      <RadioCard.ItemText>No</RadioCard.ItemText>
                      <RadioCard.ItemIndicator />
                    </RadioCard.Item>
                  </HStack>
                </RadioCard.Root>
              </Field.Root>
            </Box>
          ))}

          <Button
            {...estilosBotonEspecial}
            onClick={handleAddIndicacion}
            type="button"
            mb={4}
          >
            Añadir indicación
          </Button>
        </Fieldset.Content>
        <Button {...estilosBotonEspecial} type="submit">
          Guardar nota clínica
        </Button>
      </Fieldset.Root>
    </form>
  );
}
