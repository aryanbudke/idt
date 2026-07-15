"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Calendar,
  LayoutGrid,
  BookOpenCheck,
  School,
  Users,
  GraduationCap,
  Briefcase,
  CheckSquare,
  Clock,
  Award,
  FileEdit,
  Megaphone,
  CalendarDays,
  Settings,
  GraduationCap as LogoIcon,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export const getSidebarItems = (role: "admin" | "faculty" | "student") => {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Departments", href: "/admin/departments", icon: Building2 },
        { label: "Programs", href: "/admin/programs", icon: BookOpen },
        { label: "Semesters", href: "/admin/semesters", icon: Calendar },
        { label: "Sections", href: "/admin/sections", icon: LayoutGrid },
        { label: "Subjects", href: "/admin/subjects", icon: BookOpenCheck },
        { label: "Classrooms", href: "/admin/classrooms", icon: School },
        { label: "Faculty", href: "/admin/faculty", icon: Users },
        { label: "Students", href: "/admin/students", icon: GraduationCap },
        {
          label: "Teaching Assignments",
          href: "/admin/teaching-assignments",
          icon: Briefcase,
        },
        {
          label: "Announcements",
          href: "/admin/announcements",
          icon: Megaphone,
        },
        { label: "Events", href: "/admin/events", icon: CalendarDays },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ];
    case "faculty":
      return [
        { label: "Dashboard", href: "/faculty", icon: LayoutDashboard },
        {
          label: "Assigned Subjects",
          href: "/faculty/subjects",
          icon: BookOpen,
        },
        {
          label: "Attendance",
          href: "/faculty/attendance",
          icon: CheckSquare,
        },
        { label: "Timetable", href: "/faculty/timetable", icon: Clock },
        { label: "Assignments", href: "/faculty/assignments", icon: FileEdit },
        {
          label: "Announcements",
          href: "/faculty/announcements",
          icon: Megaphone,
        },
        { label: "Events", href: "/faculty/events", icon: CalendarDays },
      ];
    case "student":
      return [
        { label: "Dashboard", href: "/student", icon: LayoutDashboard },
        { label: "Attendance", href: "/student/attendance", icon: CheckSquare },
        { label: "Assessments", href: "/student/assessments", icon: Award },
        { label: "Timetable", href: "/student/timetable", icon: Clock },
        { label: "Assignments", href: "/student/assignments", icon: FileEdit },
        {
          label: "Announcements",
          href: "/student/announcements",
          icon: Megaphone,
        },
        { label: "Events", href: "/student/events", icon: CalendarDays },
      ];
    default:
      return [];
  }
};

interface SidebarProps {
  role: "admin" | "faculty" | "student";
  onItemClick?: () => void;
}

export function Sidebar({ role, onItemClick }: SidebarProps) {
  const items = getSidebarItems(role);

  return (
    <aside className="flex h-full w-full flex-col border-r border-outline-variant bg-surface-container-low text-on-surface p-6">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary shrink-0 shadow-sm">
          <LogoIcon className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-h3 font-h3 font-bold text-primary tracking-tight leading-none">
            EduCore ERP
          </h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1.5 capitalize tracking-wide font-medium">
            {role} Portal
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto space-y-1 pr-1 -mr-2 hide-scrollbar">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-outline-variant pt-4 mt-4 text-center">
        <span className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
          Version 1.0
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
