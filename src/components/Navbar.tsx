"use client";

import * as React from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { UserDropdown } from "./UserDropdown";

interface NavbarProps {
  onMenuOpen: () => void;
}

export function Navbar({ onMenuOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 lg:px-6">
      {/* Left section: Hamburger (mobile/tablet only) */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuOpen}
          className="lg:hidden h-9 w-9 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <span className="hidden text-sm font-semibold text-on-surface-variant lg:block">
          EduCore College ERP Platform
        </span>
      </div>

      {/* Right section: Notifications, Theme, User Profile */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface relative focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#0058be]" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeSwitcher />
        <div className="h-6 w-px bg-outline-variant" />
        <UserDropdown />
      </div>
    </header>
  );
}

export default Navbar;
