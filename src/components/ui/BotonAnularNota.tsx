"use client";

import {
  Popover,
  Portal,
  Button,
  Text,
  Input,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCrearNotaClinica } from "@/hooks/useCrearNotaClinica";

export function BotonAnularNota({
  notaId,
  mascotaId,
  expedienteId,
}: {
  notaId: number;
  mascotaId: number;
  expedienteId: number;
}) {
  const [texto, setTexto] = useState("");
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCrearNotaClinica();

  const confirmarAnulacion = () => {
    mutate({
      mascotaId,
      expedienteId,
      anularNotaId: notaId,
    });
    setTexto("");
    setOpen(false);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <Popover.Trigger asChild>
        <Button size="sm" variant="outline" colorScheme="red">
          Anular nota
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content w="sm">
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title>Anulación de nota</Popover.Title>
              <VStack gap="3" alignItems="stretch" mt="2">
                <Text fontSize="sm">
                  Para confirmar, escribe <strong>borrar</strong> y presiona confirmar.
                </Text>
                <Input
                  placeholder="Escribe 'borrar'"
                  size="sm"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value.toLowerCase())}
                />
                <HStack justify="flex-end" mt="1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={confirmarAnulacion}
                    disabled={texto !== "borrar"}
                    loading={isPending}
                  >
                    Confirmar
                  </Button>
                </HStack>
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}