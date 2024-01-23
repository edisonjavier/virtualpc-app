"use client";
import { Button, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import recoveryPasswordService from "../services/recovery-password.service";

const recoveryPasswordSchema = z.object({
  email: z.string().email({ message: "Correo invalido" })
});

export type RecoveryPasswordSchema = z.infer<typeof recoveryPasswordSchema>;

const initialValues: RecoveryPasswordSchema = {
  email: ""
};

export default function FormRecoveryPassword() {
  const form = useForm({
    validate: zodResolver(recoveryPasswordSchema),
    initialValues
  });

  const { mutate, isPending } = useMutation({
    mutationFn: recoveryPasswordService,
    onSuccess: () => {
      toast.success("Se ha enviado una contraseña temporal a su Email");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = async (values: RecoveryPasswordSchema) => {
    mutate({ email: values.email });
  };

  return (
    <div className="flex flex-col gap-3 p-5">
      <Text className="text-center font-bold text-primary">Recuperar Contraseña</Text>
      <Text className="text-center">Sera enviará una contraseña temporal a su correo electrónico.</Text>
      <form className="flex flex-col gap-3" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          classNames={{ input: "border-primary" }}
          label="Correo"
          placeholder="correo@correo.com"
          {...form.getInputProps("email")}
        />
        <Button color="blue" type="submit" className="bg-primary font-bold uppercase" loading={isPending}>
          Recuperar
        </Button>
      </form>
    </div>
  );
}
