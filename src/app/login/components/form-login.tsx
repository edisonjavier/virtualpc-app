"use client";
import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import RecoveryPassword from "./recovery-password";

const loginSchema = z.object({
  email: z.string().email({ message: "Correo invalido" }),
  password: z.string().min(6, { message: "La contraseña es muy corta" })
});

type LoginSchema = z.infer<typeof loginSchema>;

const initialValues: LoginSchema = {
  email: "",
  password: ""
};

export default function FormLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    validate: zodResolver(loginSchema),
    initialValues
  });

  const handleSubmit = async (values: LoginSchema) => {
    const { email, password } = values;
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false
    });
    if (res?.error) {
      toast.error(res.error);
    } else {
      router.push("/admin/users");
      toast.success("Bienvenido");
    }
    setLoading(false);
  };

  return (
    <div className="h-auto rounded-xl bg-gray-100 p-5 sm:min-w-[310px] sm:flex-[.8]">
      <Text className="bold text-center text-xl font-bold uppercase text-black">Ingresar</Text>
      <form className="flex flex-col gap-5" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          classNames={{ input: "border-gray-800 border-2 rounded-md" }}
          placeholder="johnsmith@email.com"
          label="Correo"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          classNames={{ input: "border-gray-800 border-2 rounded-md" }}
          placeholder="********"
          label="Contraseña"
          {...form.getInputProps("password")}
        />
        <Button type="submit" loading={loading} className="bg-primary uppercase">
          Ingresar
        </Button>
      </form>
      <RecoveryPassword />
    </div>
  );
}
