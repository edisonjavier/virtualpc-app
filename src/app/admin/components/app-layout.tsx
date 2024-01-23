"use client";
import ConfigMenu from "@/components/config-menu";
import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { ReactNode, useState } from "react";
import NavLinks from "./nav-links";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [opened, { toggle }] = useDisclosure();
  const [title, setTitle] = useState("");

  const handleLinkChange = (title: string) => {
    setTitle(title);
  };

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding="md"
      className="text-white"
    >
      <AppShell.Header className=" bg-zinc-900">
        <Group h="100%" px="md" className="flex justify-between">
          <div>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="white" />
            <Text className="hidden text-xl font-bold uppercase md:block">{title}</Text>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Text>{`${session?.user.person.surnames} ${session?.user.person.names}`}</Text>
            <ConfigMenu />
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" className=" bg-slate-100">
        <Group className="flex justify-between">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="md"
            size="md"
            color={opened ? "black" : "white"}
          />
          <div className="mb-5 flex flex-1 items-center justify-center">
            <img src="/virtual-pc-logo-2.png" alt="Virtual PC logo" width="200px" className="w-[200px]" />
          </div>
        </Group>
        <NavLinks onPathChange={handleLinkChange} />
      </AppShell.Navbar>
      <AppShell.Main className="flex bg-slate-200">
        <div className="w-full">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
