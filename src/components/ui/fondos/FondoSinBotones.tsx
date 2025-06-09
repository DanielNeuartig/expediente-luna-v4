// src/components/ui/FondoConBotones.tsx
"use client";

import { Box } from "@chakra-ui/react";
import React from "react";

export default function FondoConBotones({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      minH="100dvh"
      overflow="hidden"
      backgroundImage="url('/imagenes/FondoHomepage.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundAttachment="fixed" // ✅ esto detiene el zoom visual
    >
      {children}

      <Box
        position="fixed"
        bottom="6"
        right="6"
        zIndex="overlay"
        display="flex"
        flexDirection="row"
        gap="4"
        alignItems="center"
      >
      </Box>
    </Box>
  );
}
