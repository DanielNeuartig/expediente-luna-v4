"use client";

import { Box, Icon, FileUpload, Spinner } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { subirArchivoAS3 } from "@/lib/s3";

type Archivo = {
  // Define the properties of an archivo object based on your data structure
  // Example:
  id: string;
  nombre: string;
  url: string;
  [key: string]: unknown;
};

type Props = {
  token: string;
  archivosCargados: Archivo[];
  setArchivosCargados: (archivos: Archivo[]) => void;
  maxArchivos?: number;
};

export default function ComponenteUploadArchivos({
  token,
  archivosCargados,
  setArchivosCargados,
  maxArchivos = 5,
}: Props) {
  const [subiendo, setSubiendo] = useState(false);

  const handleUpload = async (files: File[]) => {
    if (archivosCargados.length + files.length > maxArchivos) {
      toaster.create({
        description: `Máximo ${maxArchivos} archivos!!`,
        type: "error",
      });
      return;
    }

    setSubiendo(true);

    try {
      await Promise.allSettled(
        files.map(async (archivo) => {
          try {
            await subirArchivoAS3(token, archivo);
            const res = await fetch(`/api/estudios/${token}`);
            const data = await res.json();
            setArchivosCargados(data?.solicitud?.archivos ?? []);
          } catch (e) {
            console.error("Error al subir o registrar:", archivo.name, e);
          }
        })
      );

      toaster.create({
        description: "Archivos subidos correctamente",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      toaster.create({
        description: "Error al subir archivos",
        type: "error",
      });
    } finally {
      setSubiendo(false);
    }
  };

  return subiendo ? (
    <Box
      maxW="xl"
      py={12}
      px={6}
      textAlign="center"
      bg="white"
      borderRadius="xl"
      border="2px dashed"
      borderColor="tema.llamativo"
    >
              <Spinner
                animationDuration="1s"
                borderWidth="9px"
                size="xl"
                color="tema.llamativo"
                css={{ "--spinner-track-color": "colors.gray.500" }}
              />

    </Box>
  ) : (
    <FileUpload.Root maxW="xl" alignItems="stretch">
      <FileUpload.HiddenInput
        multiple
        onChange={async (e) => {
          const nuevosArchivos = Array.from(e.target.files ?? []);
          if (!token || nuevosArchivos.length === 0) {
            toaster.create({
              description: "No hay archivos para subir",
              type: "error",
            });
            return;
          }

          await handleUpload(nuevosArchivos);
        }}
      />

      <FileUpload.Dropzone bg="white">
        <Icon size="2xl" color="tema.llamativo">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box fontSize="xl" color="tema.suave">
            Arrastra y suelta archivos aquí o haz clic
          </Box>
          <Box color="tema.intenso">.png, .jpg, .pdf hasta 5MB</Box>
          <Box color="tema.intenso">Máx. {maxArchivos} archivos</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}
