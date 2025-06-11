"use client";

import { useEffect, useState } from "react";
import {
  Box,
  chakra,
  Spinner,
  Text,
  Image,
  Link as ChakraLink,
} from "@chakra-ui/react";
import NextLink from "next/link";

type Props = {
  token: string;
  archivoId: number;
};

export default function ArchivoPreview({ token, archivoId }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const res = await fetch(`/api/estudios/${token}/archivo/${archivoId}/url`);
      if (res.ok) {
        const data = await res.json();
        setUrl(data.url);
      }
    };
    fetchUrl();
  }, [token, archivoId]);

  if (!url) {
    return (
      <Box py={4} px={2} textAlign="center" animation={"floatGlow"}>
        <Spinner size="sm" color="tema.azul" />
        <Text fontSize="sm" mt={2} color="gray.600">
          Cargando archivo...
        </Text>
      </Box>
    );
  }

  return (
    <ChakraLink
      as={NextLink}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      rounded="md"
      _hover={{ opacity: 0.85 }}
      _focus={{ boxShadow: "outline" }}
      display="block"
    >
      {url.endsWith(".pdf") ? (
        <chakra.iframe
          src={url}
          width="100%"
          height="400px"
         // border="1px solid"
          //borderColor="gray.200"
          //borderRadius="md"
          pointerEvents="none"
          title="Archivo PDF"
        />
      ) : (
        <Image
          src={url}
          alt="Archivo"
          maxW="30%"
          borderRadius="md"
          objectFit="contain"
          animation={"floatGlow"}
          mx="auto"
        />
      )}
    </ChakraLink>
  );
}