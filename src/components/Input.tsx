import { TextInput, TextInputProps } from "@mantine/core";

export default function Input(props: TextInputProps) {
  return <TextInput {...props} classNames={{ input: "border-gray-800 border-2 rounded-md" }} />;
}
