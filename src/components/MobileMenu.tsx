"use client";

import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role: "admin" | "faculty" | "student";
}

export function MobileMenu({ isOpen, onClose, role }: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="p-0 w-[280px] border-none">
        <Sidebar role={role} onItemClick={onClose} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
