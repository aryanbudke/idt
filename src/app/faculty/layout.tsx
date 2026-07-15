import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="faculty">{children}</DashboardLayout>;
}
