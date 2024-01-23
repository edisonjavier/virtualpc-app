import { Modal } from "@mantine/core";
import FormChangePassword from "./form-change-password";

interface ChangePasswordProps {
  opened: boolean;
  close: () => void;
}

export default function ChangePassword({ close, opened }: ChangePasswordProps) {
  return (
    <>
      <Modal radius="lg" padding="xs" opened={opened} onClose={close} centered>
        <FormChangePassword onSubmitSuccess={close} />
      </Modal>
    </>
  );
}
