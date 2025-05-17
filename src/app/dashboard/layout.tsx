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
      <Sidebar />
      <DashboardHeader />
      <Box

        as="main"
        ml="60"
minH="100%"
        overflowY="auto"
        px="6"
        pb="6"
        pt="20"
        bg="gray.200"
        
      >
        <DashboardGrid>{children}</DashboardGrid>
      </Box>
    </>
  );
}
