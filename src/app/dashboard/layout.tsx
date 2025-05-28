// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardGrid from "@/components/layout/DashboardGrid";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user.activo) {
    redirect("/");
  }

  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId: session.user.id },
  });

  if (!perfil) {
    redirect("/mi-perfil");
  }

  return (
    <>
      {/* Sidebar solo en escritorio */}
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      {/* Header */}
      <DashboardHeader />

      {/* Contenido principal */}
      <Box
        as="main"
        ml={{ base: 0, md: "60" }}
        minH="100dvh"
        overflowY="auto"
        px="6"
        pb="6"
        pt={{ base: "24", md: "20" }} // 🔁 padding top responsivo para evitar solapamiento
        bg="gray.200"
      >
        <DashboardGrid>{children}</DashboardGrid>
      </Box>
    </>
  );
}