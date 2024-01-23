"use client";
import ConfirmDialog from "@/components/confirm-dialog";
import DataTable from "@/components/data-table";
import ExportButton from "@/components/export-button";
import { UserModel } from "@/models/user.model";
import { ActionIcon, Button, Modal, Text, TextInput, Tooltip } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteUserService } from "../services/delte-user.service";
import getUsersService from "../services/get-users.service";
import FormUser, { UserSchema } from "./form-user";

export default function UsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersService
  });
  const [users, setUsers] = useState<UserModel[] | undefined>();
  const [opened, { close, open }] = useDisclosure();
  const [openedDialog, { close: closeDialog, open: openDialog }] = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<UserSchema>();
  const [search, setSearch] = useState<string>("");
  const [debounced] = useDebouncedValue(search, 300);
  const queryClient = useQueryClient();

  const handleClickCreate = () => {
    open();
    setSelectedUser(undefined);
  };

  const handleClickEdit = (value: UserModel) => {
    open();
    const selectedUser: UserSchema = {
      ...value,
      roleId: value.role.roleId === null ? value.role.roleId : value.role.roleId.toString()
    };
    setSelectedUser(selectedUser);
  };

  const handleClickDelete = (value: UserModel) => {
    openDialog();
    const selectedUser: UserSchema = {
      ...value,
      roleId: value.role.roleId === null ? value.role.roleId : value.role.roleId.toString()
    };
    setSelectedUser(selectedUser);
  };

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteUserService,
    onSuccess: async () => {
      toast.success("Usuario eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUser(undefined);
      closeDialog();
    }
  });

  const usersColumns = useMemo<DataTableColumn<UserModel>[]>(
    () => [
      {
        accessor: "names",
        title: "Nombres",
        render: ({ person }) => <Text>{`${person.names} ${person.surnames}`}</Text>
      },
      {
        accessor: "user.email",
        title: "Correo"
      },
      {
        accessor: "person.dni",
        title: "Cédula"
      },
      {
        accessor: "person.phone",
        title: "Teléfono"
      },
      {
        accessor: "person.address",
        title: "Dirección"
      },
      {
        accessor: "age",
        title: "Edad",
        render: ({ person: { birthdate } }) => <Text>{dayjs().diff(birthdate, "years")}</Text>
      },
      {
        accessor: "role.roleName",
        title: "Rol"
      },
      {
        accessor: "actions",
        title: "Acciones",
        render: (value) => (
          <div className="flex gap-2">
            <Tooltip label="Eliminar">
              <ActionIcon color="red" variant="light" onClick={() => handleClickDelete(value)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Editar">
              <ActionIcon color="yellow" variant="light" onClick={() => handleClickEdit(value)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
          </div>
        )
      }
    ],
    []
  );

  const generalFilter = (value: string) => {
    if (!value.trim()) {
      setUsers(data);
      return;
    }
    const filteredList = data?.filter((item) => {
      const { person, user, role } = item;
      const emailMatch = user.email.toLowerCase().includes(value.trim().toLowerCase());
      const namesMatch = person.names.toLowerCase().includes(value.trim().toLowerCase());
      const surnamesMatch = person.surnames.toLowerCase().includes(value.trim().toLowerCase());
      const dniMatch = person.dni.toLowerCase().includes(value.trim().toLowerCase());
      const addressMatch = person.address.toLowerCase().includes(value.trim().toLowerCase());
      const phoneMatch = person.phone.toLowerCase().includes(value.trim().toLowerCase());
      const roleMatch = role.roleName.toLocaleLowerCase().includes(value.trim().toLowerCase());
      const ageMatch = dayjs()
        .diff(person.birthdate, "years")
        .toString()
        .includes(value.trim().toLowerCase());
      return (
        emailMatch ||
        namesMatch ||
        surnamesMatch ||
        dniMatch ||
        addressMatch ||
        phoneMatch ||
        roleMatch ||
        ageMatch
      );
    });
    setUsers(filteredList);
  };

  useEffect(() => {
    generalFilter(debounced);
  }, [debounced]);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  const getUsersExportData = () => {
    const TITLE = "Lista de usuarios";
    const rec = data?.map(({ user, person, role }) => ({
      names: `${person.names} ${person.surnames}`,
      "user.email": user.email,
      "person.dni": person.dni,
      "person.phone": person.phone,
      "person.address": person.address,
      age: dayjs().diff(person.birthdate, "years").toString(),
      "role.roleName": role.roleName
    }));

    const columns = usersColumns
      .filter((col) => col.accessor !== "actions")
      .map((col) => ({
        accessor: col.accessor,
        title: col.title as string
      }));

    return { records: rec ?? [], columns, title: TITLE };
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex gap-5">
        <TextInput placeholder="Buscar" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Button className="rounded-lg bg-primary" onClick={handleClickCreate}>
          Crear Usuario
        </Button>
        <ExportButton exportData={getUsersExportData()} fileName="usuarios" />
      </div>
      <DataTable records={users} columns={usersColumns} fetching={isLoading} />
      <Modal radius="lg" padding="xs" opened={opened} onClose={close} centered>
        <FormUser initialValues={selectedUser} onSubmitSuccess={close} />
      </Modal>
      <ConfirmDialog
        opened={openedDialog}
        message="¿Está seguro que desea eliminar este usuario?"
        onClose={closeDialog}
        loading={isPendingDelete}
        onConfirm={() => mutateDelete(selectedUser?.user.userId ?? 0)}
      />
    </div>
  );
}
