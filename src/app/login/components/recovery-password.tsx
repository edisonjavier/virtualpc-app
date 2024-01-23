"use client";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FormRecoveryPassword from "./form-recovery-password";

export default function RecoveryPassword() {
  const [opened, { close, open }] = useDisclosure();
  return (
    <>
      <Button variant="subtle" className="w-full text-center text-primary" onClick={open}>
        ¿Olvidó su contraseña?
      </Button>
      <Modal radius="lg" padding="xs" opened={opened} onClose={close} centered>
        <FormRecoveryPassword />
      </Modal>
    </>
  );
}
