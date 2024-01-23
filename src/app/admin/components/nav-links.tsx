"use client";
import NextNavLink from "@/components/next-nav-link";
import { cn } from "@/utils";
import { IconUsers } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const links = [{ label: "Usuarios", href: "/admin/users", icon: IconUsers }];

export default function NavLinks({ onPathChange }: { onPathChange: (label: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    const link = links.find((link) => link.href === pathname);
    onPathChange(link?.label || "");
  }, [pathname, onPathChange]);
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <NextNavLink
            key={link.label}
            label={link.label}
            href={link.href}
            leftSection={<LinkIcon />}
            className={cn(
              " mt-2 rounded-lg hover:bg-gray-500",
              pathname === link.href && "bg-gray-400 font-bold"
            )}
          />
        );
      })}
    </>
  );
}
