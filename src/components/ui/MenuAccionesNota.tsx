// src/components/ui/MenuAccionesNota.tsx
"use client";

import {
  Menu,
  Button,
  Portal,
  IconButton,
} from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";

export default function MenuAccionesNota({
  onAnular,
  onReemplazar,
}: {
  onAnular: () => void;
  onReemplazar: () => void;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="Acciones"
          size="xs"
          variant="ghost"
        >
          <MoreVertical size={16} />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="anular" onSelect={onAnular}>
              Anular nota
            </Menu.Item>
            <Menu.Item value="reemplazar" onSelect={onReemplazar}>
              Reemplazar nota
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}