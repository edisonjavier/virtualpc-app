import { Metadata } from "next";
import { ReactNode } from "react";
import AppLayout from "./components/app-layout";

export const metadata: Metadata = {
  title: "VIRTUALPC - Usuarios",
  description: "VIRTUALPC app"
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
