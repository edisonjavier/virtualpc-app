"use client";
import Input from "@/components/Input";
import { validateEcuadorianIdCard } from "@/utils/validate-ecuadorian-id-card.util";
import { Button, PasswordInput, Select, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import createUserService from "../services/create-user.service";
import editUserService from "../services/edit-user.service";
import { getRolesService } from "../services/get-roles.service";

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

const userSchema = z.object({
  user: z.object({
    userId: z.optional(z.number()),
    email: z.string().email({ message: "Correo invalido" }),
    password: z.string().min(6, { message: "La contraseña es muy corta" })
  }),
  person: z.object({
    personId: z.optional(z.number()),
    dni: z
      .string()
      .length(10)
      .refine((value) => validateEcuadorianIdCard(value), "Ingrese una cédula valida"),
    names: z.string().min(1, "El nombre es muy corto"),
    surnames: z.string().min(1, "El apellido es muy corto"),
    birthdate: z
      .date()
      .max(dayjs().toDate(), "Ingrese una fecha valida")
      .min(dayjs().subtract(80, "years").toDate(), "Ingrese una fecha valida"),
    phone: z.string().regex(phoneRegex, "Numero de teléfono invalido"),
    address: z.string().min(1, "La dirección es muy corta")
  }),
  roleId: z
    .string({ required_error: "El rol es obligatorio" })
    .nullish()
    .refine((value) => value !== null, "El rol es obligatorio")
});

export type UserSchema = z.infer<typeof userSchema>;

const initialUserSchema: UserSchema = {
  user: {
    email: "",
    password: ""
  },
  person: {
    dni: "",
    names: "",
    surnames: "",
    birthdate: new Date(),
    phone: "",
    address: ""
  },
  roleId: null
};

type RoleSelect = {
  label: string;
  value: string;
};

interface FormUserProps {
  initialValues?: UserSchema;
  onSubmitSuccess: () => void;
}

export default function FormUser({ initialValues, onSubmitSuccess }: FormUserProps) {
  const [roles, serRoles] = useState<RoleSelect[]>();
  const queryClient = useQueryClient();
  const idRef = useRef(initialValues?.user.userId);

  // Init Form
  const form = useForm({
    validate: zodResolver(userSchema),
    initialValues: initialValues?.user.userId
      ? {
          user: initialValues.user,
          person: {
            ...initialValues.person,
            birthdate: new Date(initialValues.person.birthdate)
          }
        }
      : initialUserSchema
  });

  // Services
  const getRoles = async () => {
    const res = await getRolesService();
    const roles = res.map((rol) => ({ label: rol.roleName, value: rol.roleId.toString() }));
    serRoles(roles);
  };

  // Mutations
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    onSubmitSuccess();
  };

  const { mutate: createMutation, isPending: isPendingCreate } = useMutation({
    mutationFn: createUserService,
    onSuccess: () => {
      handleSuccess();
      toast.success("Usuario creado exitosamente");
    }
  });

  const { mutate: editMutation, isPending: isPendingEdit } = useMutation({
    mutationFn: editUserService,
    onSuccess: () => {
      handleSuccess();
      toast.success("Usuario editado exitosamente");
    }
  });

  // Submit

  const handleSubmit = async (values: UserSchema) => {
    if (idRef.current) {
      return editMutation(values);
    }
    createMutation(values);
  };

  // Effects
  useEffect(() => {
    getRoles();
  }, []);

  return (
    <form className="grid grid-cols-2 gap-3 p-4" onSubmit={form.onSubmit(handleSubmit)}>
      <Text className="col-span-2 text-center text-xl font-bold text-primary">
        {idRef.current ? "Editar Usuario" : "Crear Usuario"}
      </Text>
      <Input
        placeholder="johnsmith@email.com"
        className="col-span-2"
        label="Correo"
        {...form.getInputProps("user.email")}
      />
      {!idRef.current && (
        <PasswordInput
          className="col-span-2"
          classNames={{ input: "border-gray-800 border-2 rounded-md" }}
          placeholder="********"
          label="Contraseña"
          {...form.getInputProps("user.password")}
        />
      )}
      <Input placeholder="John" label="Nombres" {...form.getInputProps("person.names")} />
      <Input placeholder="Smith" label="Apellidos" {...form.getInputProps("person.surnames")} />
      <Input placeholder="0000000000" label="Cédula" {...form.getInputProps("person.dni")} />
      <Input placeholder="09********" label="Teléfono" {...form.getInputProps("person.phone")} />
      <DateInput
        classNames={{ input: "border-gray-800 border-2 rounded-md" }}
        label="Fecha de nacimiento"
        {...form.getInputProps("person.birthdate")}
      />
      <Input placeholder="Dirección" label="Dirección" {...form.getInputProps("person.address")} />
      <Select
        label="Rol"
        data={roles}
        defaultChecked
        defaultValue={initialValues ? initialValues.roleId : null}
        placeholder="Seleccione un rol"
        className="col-span-2"
        {...form.getInputProps("roleId")}
      />
      <Button
        type="submit"
        className="col-span-2 bg-primary uppercase"
        loading={isPendingCreate || isPendingEdit}
      >
        {idRef.current ? "Editar" : "Crear"}
      </Button>
    </form>
  );
}
