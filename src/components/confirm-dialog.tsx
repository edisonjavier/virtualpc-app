import { Box, Button, Modal, Text } from "@mantine/core";

interface ConfirmDialogProps {
  opened: boolean;
  message: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}
export default function ConfirmDialog({ opened, onClose, message, onConfirm, loading }: ConfirmDialogProps) {
  const handleConfirm = async () => {
    onConfirm();
  };
  return (
    <Modal
      classNames={{ body: "bg-slate-100 flex flex-col gap-4", header: "bg-slate-100" }}
      opened={opened}
      onClose={onClose}
      title="Confirmar"
      centered
    >
      <Text className="mt-2 text-center">{message}</Text>
      <Box className="flex justify-between">
        <Button onClick={onClose} disabled={loading} color="black" variant="light">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} loading={loading} className="bg-red-500">
          Aceptar
        </Button>
      </Box>
    </Modal>
  );
}
