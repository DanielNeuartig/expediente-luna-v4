"use client";

import {
  Box,
  Text,
  Button,
  Menu,
  Portal,
  MenuPositioner,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";
import { LuStethoscope } from "react-icons/lu";
import type { ExpedienteConNotas } from "@/types/expediente";
import { useCrearExpedienteMedico } from "@/hooks/useExpedienteMedico";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";

type Props = {
  mascotaId: number;
  onExpedienteCreado: (expediente: ExpedienteConNotas) => void;
};

const tipos: {
  label: string;
  value: "CONSULTA" | "CIRUGIA" | "HOSPITALIZACION" | "LABORATORIO" | "OTRO";
}[] = [
  { label: "Consulta médica", value: "CONSULTA" },
  { label: "Cirugía", value: "CIRUGIA" },
  { label: "Hospitalización", value: "HOSPITALIZACION" },
  { label: "Laboratorio", value: "LABORATORIO" },
  { label: "Otro", value: "OTRO" },
];

export default function MenuIniciarAtencion({
  mascotaId,
  onExpedienteCreado,
}: Props) {
  const mutation = useCrearExpedienteMedico(onExpedienteCreado);

  return (
    <Box mt="4">
      <Text fontSize="sm" mb="2">
        No hay expediente médico activo actualmente.
      </Text>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button
            {...estilosBotonEspecial}
            size="lg"
            loading={mutation.isPending}
          >
            <LuStethoscope /> Iniciar atención médica
          </Button>
        </Menu.Trigger>
        <Portal>
          <MenuPositioner>
            <MenuContent>
              {tipos.map((tipo) => (
                <MenuItem
                  key={tipo.value}
                  value={tipo.value}
                  onSelect={() =>
                    mutation.mutate({ mascotaId, tipo: tipo.value })
                  }
                >
                  {tipo.label}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
}