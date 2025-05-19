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
} from "@chakra-ui/react";
import { useState } from "react";

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

export default function FormularioNotaClinicaVisual() {
  // Inicializan VACÍOS, no hay ningún medicamento ni indicación al inicio
  const [medicamentos, setMedicamentos] = useState<object[]>([]);
  const [indicaciones, setIndicaciones] = useState<object[]>([]);
  const [medHorarios, setMedHorarios] = useState<MedicamentoHorario[]>([]);

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
      prev.map((h, i) =>
        i === idx ? { ...h, [campo]: valor } : h
      )
    );
  };

  const calcularFechas = (desde: string, frecuenciaHoras: string, veces: string) => {
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
    console.log("🧾 Datos enviados:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root size="lg" width="full">
        <Stack>
          <Fieldset.Legend color="tema.intenso">Nota clínica</Fieldset.Legend>
          <Fieldset.HelperText>
            Registra todos los datos clínicos
          </Fieldset.HelperText>
        </Stack>
        <Fieldset.Content>
          <HStack>
            <Field.Root>
              <Field.Label color="tema.suave">Historia clínica</Field.Label>
              <Textarea color="tema.suave" name="historiaClinica" />
            </Field.Root>
            <Field.Root>
              <Field.Label color="tema.suave">Exploración física</Field.Label>
              <Textarea color="tema.suave" name="exploracionFisica" />
            </Field.Root>
          </HStack>
          <HStack>
            <Field.Root>
              <Field.Label color="tema.suave">Temperatura (°C)</Field.Label>
              <Input
                color="tema.suave"
                name="temperatura"
                type="number"
                step="0.1"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label color="tema.suave">Peso (kg)</Field.Label>
              <Input color="tema.suave" name="peso" type="number" step="0.1" />
            </Field.Root>
            <Field.Root>
              <Field.Label color="tema.suave">FC</Field.Label>
              <Input
                color="tema.suave"
                name="frecuenciaCardiaca"
                type="number"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label color="tema.suave">FR</Field.Label>
              <Input
                color="tema.suave"
                name="frecuenciaRespiratoria"
                type="number"
              />
            </Field.Root>
          </HStack>
          <HStack>
            <Field.Root>
              <Field.Label color="tema.suave">Diagnóstico presuntivo</Field.Label>
              <Textarea color="tema.suave" name="diagnosticoPresuntivo" />
            </Field.Root>
            <Field.Root>
              <Field.Label color="tema.suave">Pronóstico</Field.Label>
              <Textarea color="tema.suave" name="pronostico" />
            </Field.Root>
          </HStack>
          <HStack>
            <Field.Root>
              <Field.Label color="tema.suave">Laboratoriales</Field.Label>
              <Textarea color="tema.suave" name="laboratoriales" />
            </Field.Root>
            <Field.Root>
              <Field.Label color="tema.suave">Extras</Field.Label>
              <Textarea color="tema.suave" name="extras" />
            </Field.Root>
          </HStack>

          {/* Medicamentos dinámicos (si hay alguno) */}
          {medicamentos.map((_, index) => (
            <Box key={index} borderWidth="1px" p="4" rounded="md">
              <Fieldset.Legend color="tema.intenso">
                Medicamento #{index + 1}
              </Fieldset.Legend>
              <HStack>
                <Field.Root>
                  <Field.Label color="tema.suave">Nombre</Field.Label>
                  <Input color="tema.suave" name={`medicamentos[${index}].nombre`} />
                </Field.Root>
                <Field.Root>
                  <Field.Label color="tema.suave">Dosis</Field.Label>
                  <Input color="tema.suave" name={`medicamentos[${index}].dosis`} />
                </Field.Root>
                <Field.Root>
                  <Field.Label color="tema.suave">Vía</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      color="tema.suave"
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
                  <Field.Label color="tema.suave">Cada cuántas horas</Field.Label>
                  <Input
                    color="tema.suave"
                    name={`medicamentos[${index}].frecuenciaHoras`}
                    type="number"
                    value={medHorarios[index]?.frecuenciaHoras || ""}
                    onChange={e =>
                      handleHorarioChange(index, "frecuenciaHoras", e.target.value)
                    }
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label color="tema.suave">Veces</Field.Label>
                  <Input
                    color="tema.suave"
                    name={`medicamentos[${index}].veces`}
                    type="number"
                    value={medHorarios[index]?.veces || ""}
                    onChange={e =>
                      handleHorarioChange(index, "veces", e.target.value)
                    }
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label color="tema.suave">Desde</Field.Label>
                  <Input
                    color="tema.suave"
                    name={`medicamentos[${index}].desde`}
                    type="datetime-local"
                    value={medHorarios[index]?.desde || fechaAhora}
                    onChange={e =>
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
                <Field.Label color="tema.suave">Observaciones</Field.Label>
                <Textarea
                  color="tema.suave"
                  name={`medicamentos[${index}].observaciones`}
                  placeholder="Observaciones sobre el medicamento"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label color="tema.suave">¿Incluir en receta?</Field.Label>
                <RadioCard.Root
                  color="tema.suave"
                  name={`medicamentos[${index}].incluirEnReceta`}
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

          <Button onClick={handleAddMedicamento} type="button" mb={2}>
            Añadir medicamento
          </Button>

          {/* Indicaciones dinámicas */}
          {indicaciones.map((_, index) => (
            <Box key={index} borderWidth="1px" p="4" rounded="md">
              <Fieldset.Legend color="tema.intenso">
                Indicación #{index + 1}
              </Fieldset.Legend>

              <Field.Root>
                <Field.Label color="tema.suave">Descripción</Field.Label>
                <Textarea
                  color="tema.suave"
                  name={`indicaciones[${index}].descripcion`}
                />
              </Field.Root>
              <HStack>
                <Field.Root>
                  <Field.Label color="tema.suave">
                    Cada cuántas horas
                  </Field.Label>
                  <Input
                    color="tema.suave"
                    name={`indicaciones[${index}].frecuenciaHoras`}
                    type="number"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label color="tema.suave">Veces</Field.Label>
                  <Input
                    color="tema.suave"
                    name={`indicaciones[${index}].veces`}
                    type="number"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label color="tema.suave">Desde</Field.Label>
                  <Input
                    color="tema.suave"
                    name={`indicaciones[${index}].desde`}
                    type="datetime-local"
                    defaultValue={fechaAhora}
                  />
                </Field.Root>
              </HStack>
              <Field.Root>
                <Field.Label color="tema.suave">Observaciones</Field.Label>
                <Textarea
                  color="tema.suave"
                  name={`indicaciones[${index}].observaciones`}
                  placeholder="Observaciones sobre la indicación"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label color="tema.suave">
                  ¿Incluir en receta?
                </Field.Label>
                <RadioCard.Root
                  color="tema.suave"
                  name={`indicaciones[${index}].incluirEnReceta`}
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

          <Button onClick={handleAddIndicacion} type="button" mb={4}>
            Añadir indicación
          </Button>
        </Fieldset.Content>
        <Button type="submit">Guardar nota clínica</Button>
      </Fieldset.Root>
    </form>
  );
}