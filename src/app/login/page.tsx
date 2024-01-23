"use client";
import { Card } from "@mantine/core";
import FormLogin from "./components/form-login";

export default function LoginPage() {
  return (
    <Card
      className="flex w-full flex-col gap-5 rounded-xl bg-gray-400 sm:w-[43rem] sm:flex-row 
        sm:justify-between"
    >
      <Card.Section className="flex items-center justify-center p-5">
        <img src="/virtual-pc-logo-1.png" alt="Virtual PC logo" width="240px" className="w-[300px]" />
      </Card.Section>
      <FormLogin />
    </Card>
  );
}
