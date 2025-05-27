"use client";

import {
  Fieldset,
  Button,
  Stack,
  Field,
  Input,
  HStack,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perfilSchema, PerfilFormData } from "@/lib/validadores/perfilSchema";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { crearPerfil } from "@/lib/api/crearPerfil";
import { toaster } from "@/components/ui/toaster";
import InputNombreFormateado from "./InputNombreFormateado";
import InputTelefonoConClave from "./InputTelefonoConClave";
import VerificacionSMS from "./VerificacionSMS";
import InputTelefonosAdicionales from "./InputTelefonosAdicionales";
import TarjetaBase from "./TarjetaBase";
import { estilosBotonEspecial } from "./config/estilosBotonEspecial";
import { estilosInputBase } from "./config/estilosInputBase";
import { estilosTituloInput } from "./config/estilosTituloInput";

interface FormularioPerfilProps {
  mostrarVerificacionSMS?: boolean;
}

export default function FormularioPerfil({
  mostrarVerificacionSMS = true,
}: FormularioPerfilProps) {
  const router = useRouter();

  const methods = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    mode: "onChange",
    defaultValues: {
      clave: "+52",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = methods;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: crearPerfil,
    onSuccess: () => {
      toaster.create({
        description: "Perfil creado exitosamente",
        type: "success",
      });
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      toaster.create({
        description: mensaje,
        type: "error",
      });
    },
  });

  const onSubmit = async (data: PerfilFormData) => {
    const datosAEnviar = { ...data };

    if (!mostrarVerificacionSMS) {
      delete datosAEnviar.codigoVerificacion;
    }

    await mutateAsync(datosAEnviar);
  };

  return (
    <TarjetaBase>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset.Root>
            <Stack gap={4}>
              <Stack>
                <Fieldset.Legend color="tema.intenso" fontWeight="bold">
                  Crear perfil
                </Fieldset.Legend>
              </Stack>

              <Fieldset.Content>
                <InputNombreFormateado
                  name="nombre"
                  label="Nombre completo"
                  autoFocus
                />

                <InputTelefonoConClave />
                {mostrarVerificacionSMS && <VerificacionSMS />}
                <InputTelefonosAdicionales />
              </Fieldset.Content>

              <HStack>
                <Field.Root invalid={!!errors.prefijo}>
                  <Field.Label {...estilosTituloInput}>Prefijo</Field.Label>
                  <Input {...estilosInputBase} {...register("prefijo")} />
                  <Field.ErrorText>{errors.prefijo?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label {...estilosTituloInput}>
                    Documento de identificación
                  </Field.Label>
                  <Input {...estilosInputBase} {...register("documentoId")} />
                </Field.Root>
              </HStack>
              <Button
                {...estilosBotonEspecial}
                type="submit"
                loading={isPending}
                disabled={!isValid}
              >
                Guardar perfil
              </Button>
            </Stack>
          </Fieldset.Root>
        </form>
      </FormProvider>
    </TarjetaBase>
  );
}
