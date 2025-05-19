"use client";

import { Box, VStack, Text, Image } from "@chakra-ui/react";
import { Home, PlusSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { label: "Inicio", icon: Home, href: "/dashboard" },
    {
      label: "Crear perfil",
      icon: PlusSquare,
      href: "/dashboard/crear-perfil-propietario",
    },
  ];

  return (
    <Box
      as="aside"
      w="60"
      h="100dvh"
      position="fixed"
      top={0}
      left={0}
      bg="tema.intenso"
      zIndex="overlay"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      py="6"
      px="4"
      boxShadow="lg"
    >
      {/* Logo */}
      <Box
        mb="6"
        pb="4"
        borderBottom="1px solid"
        borderColor="whiteAlpha.300"
        textAlign="center"
      >
        <Image
          src="/imagenes/LogoBordesReducidos.png"
          alt="Logo"
          w="80%"
          borderRadius="xl"
          mx="auto"
        />
      </Box>

      {/* Menú */}
      <VStack align="stretch" gap="2">
        {menu.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;

          return (
            <Link key={label} href={href} passHref>
              <Box
                as="span"
                display="flex"
                alignItems="center"
                gap="3"
                px="4"
                py="2"
                borderRadius="lg"
                transition="all 0.2s"
                position="relative"
                bg={isActive ? "#1A1E24" : "transparent"}
                color={isActive ? "tema.llamativo" : "inherit"}
                //fontWeight={isActive ? "bold" : "normal"}
                _hover={
                  isActive
                    ? {} // no hacer nada si es el activo
                    : {
                        bg: "gray.500",
                        cursor: "pointer",
                      }
                }
                _before={
                  isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "8%",
                        bottom: "8%",
                        width: "4px",
                        borderRadius: "full",
                        bg: "tema.llamativo",
                      }
                    : undefined
                }
              >
                <Icon size={40} />
                <Text color="tema.claro"fontSize="sm">{label}</Text>
              </Box>
            </Link>
          );
        })}
      </VStack>

      {/* Footer opcional */}
      <Box mt="auto" textAlign="center">
        Expediente Luna © 2025
      </Box>
    </Box>
  );
}
