"use client";

import {
  Menu,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import { NotaClinica, EstadoNotaClinica } from "@prisma/client";

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
  const puedeFirmar =
    nota.estado === EstadoNotaClinica.EN_REVISION &&
    nota.autor.id === perfilActualId;

  return (
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
              <Menu.Item value="firmar" onSelect={onFirmar}>
                Firmar nota
              </Menu.Item>
            )}
            <Menu.Item value="anular" onSelect={onAnular}>
              Anular nota
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}