import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
  h="100vh"
  overflowY="auto"
  px="6"
  pb="6"
bg="gray.200"
>
  <Box pt="20"> 
        {children}
        </Box>
      </Box>
    </>
  );
}