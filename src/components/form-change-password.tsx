import changePasswordService from "@/app/admin/users/services/change-password.service";
import { Button, PasswordInput, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, { message: "La contraseña es muy corta" }),
    newPassword: z.string().min(6, { message: "La contraseña es muy corta" }),
    confirmPassword: z.string().min(6, { message: "La contraseña es muy corta" })
  })
  .refine((schema) => schema.newPassword === schema.confirmPassword, {
    message: "La nueva contraseña y la confirmación deben coincidir",
    path: ["confirmPassword"]
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

const initialValues: ChangePasswordSchema = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
};

interface FormChangePasswordProps {
  onSubmitSuccess: () => void;
}

export default function FormChangePassword({ onSubmitSuccess }: FormChangePasswordProps) {
  const { data } = useSession();

  const form = useForm({
    validate: zodResolver(changePasswordSchema),
    initialValues
  });

  const { mutate, isPending } = useMutation({
    mutationFn: changePasswordService,
    onSuccess: () => {
      toast.success("Su contraseña se ha cambiado exitosamente");
      onSubmitSuccess();
    }
  });

  const handleSubmit = (changePassword: ChangePasswordSchema) => {
    mutate({ userId: data?.user.userId ?? 0, changePasswordSchema: changePassword });
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={form.onSubmit(handleSubmit)}>
      <Text className="text-center text-lg font-bold uppercase text-primary">Cambiar contraseña</Text>
      <PasswordInput
        classNames={{ input: "border-gray-800 border-2 rounded-md" }}
        label="Anterior Contraseña"
        placeholder="******"
        {...form.getInputProps("oldPassword")}
      />
      <PasswordInput
        classNames={{ input: "border-gray-800 border-2 rounded-md" }}
        label="Nueva Contraseña"
        placeholder="******"
        {...form.getInputProps("newPassword")}
      />
      <PasswordInput
        classNames={{ input: "border-gray-800 border-2 rounded-md" }}
        label="Confirmar Contraseña"
        placeholder="******"
        {...form.getInputProps("confirmPassword")}
      />
      <Button type="submit" loading={isPending} className="bg-primary uppercase">
        Cambiar
      </Button>
    </form>
  );
}
