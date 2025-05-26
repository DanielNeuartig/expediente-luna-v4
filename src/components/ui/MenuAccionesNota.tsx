"use client";

import {
  Menu,
  IconButton,
  Portal,
  Dialog,
  Button,
  CloseButton,
} from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import { NotaClinica, EstadoNotaClinica } from "@prisma/client";
import { useState } from "react";

type Props = {
  nota: Pick<NotaClinica, "id" | "estado"> & {
    autor: { id: number };
  };
  perfilActualId: number;
  onAnular: () => void;
  onFirmar: () => void;
};

export default function MenuAccionesNota({
  nota,
  perfilActualId,
  onAnular,
  onFirmar,
}: Props) {
  const [abrirDialogoAnular, setAbrirDialogoAnular] = useState(false);
  const [abrirDialogoFirmar, setAbrirDialogoFirmar] = useState(false);

  const puedeFirmar =
    nota.estado === EstadoNotaClinica.EN_REVISION &&
    nota.autor.id === perfilActualId;

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label="Acciones" size="xs" variant="ghost">
            <MoreVertical size={16} />
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {puedeFirmar && (
                <Menu.Item value="firmar" onSelect={() => setAbrirDialogoFirmar(true)}>
                  Firmar nota
                </Menu.Item>
              )}
              <Menu.Item value="anular" onSelect={() => setAbrirDialogoAnular(true)}>
                Anular nota
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* Dialogo para Anular */}
      <Dialog.Root
        open={abrirDialogoAnular}
        onOpenChange={({ open }: { open: boolean }) => setAbrirDialogoAnular(open)}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>¿Anular esta nota?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  Esta acción no se puede deshacer. La nota se marcará como anulada y
                  todas las aplicaciones pendientes relacionadas a la nota se
                  marcarán como canceladas. Las aplicaciones ya firmadas no se verán
                  afectadas.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancelar</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={() => {
                    setAbrirDialogoAnular(false);
                    onAnular();
                  }}
                >
                  Confirmar anulación
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Dialogo para Firmar */}
      <Dialog.Root
        open={abrirDialogoFirmar}
        onOpenChange={({ open }: { open: boolean }) => setAbrirDialogoFirmar(open)}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>¿Firmar esta nota?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  Una vez firmada, se generarán las aplicaciones programdas de medicamentos relacionadas a la nota. Esta acción NO debería de anularse.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancelar</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="green"
                  onClick={() => {
                    setAbrirDialogoFirmar(false);
                    onFirmar();
                  }}
                >
                  Confirmar firma
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}