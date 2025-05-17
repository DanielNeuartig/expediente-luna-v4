"use client";

import { Box } from "@chakra-ui/react";
import { estilosTarjetaBase } from "./config/estilosTarjetaBase";

export default function TarjetaBase({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box {...estilosTarjetaBase}>{children}</Box>;
}
