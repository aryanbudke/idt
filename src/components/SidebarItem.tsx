"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function SidebarItem({
  label,
  href,
  icon: Icon,
  onClick,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 active:scale-95",
        isActive
          ? "bg-secondary-container text-on-secondary-container font-bold"
          : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          isActive ? "text-on-secondary-container" : "text-outline"
        )}
      />
      <span className="text-label-md font-label-md">{label}</span>
    </Link>
  );
}

export default SidebarItem;
