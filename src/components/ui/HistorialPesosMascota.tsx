// src/components/ui/HistorialPesosMascota.tsx
"use client";

import { Table, Box, Text } from "@chakra-ui/react";

type PesoItem = {
  peso: number | null;
  fecha: string;
};

type Props = {
  historial: PesoItem[];
};

export default function HistorialPesosMascota({ historial }: Props) {
  // Ordenar de más antiguo a más reciente
  const datos = (historial ?? [])
    .filter((p) => typeof p.peso === "number" && !isNaN(p.peso))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  if (datos.length === 0) {
    return (
      <Box p="4">
        <Text fontSize="sm" color="tema.suave">
          No hay registros históricos de peso para esta mascota.
        </Text>
      </Box>
    );
  }

  return (
    <Box p="4" borderRadius="xl" bg="tema.suave">
      <Text fontWeight="bold" mb="2">
        Historial de peso
      </Text>
      <Table.Root size="sm" interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Fecha</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Peso (kg)</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {datos.map((item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>
                {new Date(item.fecha).toLocaleDateString("es-MX", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Table.Cell>
              <Table.Cell textAlign="end">
                {item.peso?.toFixed(2)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}