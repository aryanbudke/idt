"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { Breadcrumb } from "./Breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "faculty" | "student";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-surface">
      {/* Desktop Sidebar (fixed 280px, hidden on mobile/tablet viewports) */}
      <div className="hidden lg:block lg:w-[280px] lg:shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Main Workspace (fluid) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuOpen={() => setIsSidebarOpen(true)} />

        {/* Workspace Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Breadcrumb section */}
          <div className="flex items-center justify-between pb-1">
            <Breadcrumb />
          </div>

          {/* Main workspace card wrapper matching Stitch guidelines */}
          <div className="min-h-[calc(100vh-148px)] rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      <MobileMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role={role}
      />
    </div>
  );
}

export default DashboardLayout;
