import * as React from "react";
import { Users, Building2, CalendarDays } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let facultyCount = 0;
  let departmentCount = 0;
  let eventCount = 0;

  try {
    const [fCount, dCount, eCount] = await Promise.all([
      prisma.faculty.count(),
      prisma.department.count(),
      prisma.event.count({
        where: {
          eventDate: {
            gte: new Date(),
          },
        },
      }),
    ]);
    facultyCount = fCount;
    departmentCount = dCount;
    eventCount = eCount;
  } catch (error) {
    console.error("Failed to fetch dashboard stats from database:", error);
  }

  const stats = [
    {
      label: "Total Faculty",
      value: facultyCount.toLocaleString(),
      icon: Users,
      change: `Teaching across ${departmentCount} departments`,
    },
    {
      label: "Departments",
      value: departmentCount.toLocaleString(),
      icon: Building2,
      change: "Academic divisions active",
    },
    {
      label: "Upcoming Events",
      value: eventCount.toLocaleString(),
      icon: CalendarDays,
      change: "Scheduled upcoming events",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-h2 font-h2 font-bold tracking-tight text-on-surface">
          Welcome back, Admin
        </h1>
        <p className="text-body-sm font-body-sm text-on-surface-variant mt-1.5 font-medium">
          Here is a high-level overview of the college operations today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                  {stat.label}
                </span>
                <div className="rounded-md bg-[#0058be]/10 p-2.5 text-[#0058be]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-h2 font-h2 font-bold tracking-tight text-on-surface">
                  {stat.value}
                </span>
                <p className="mt-1.5 text-body-sm font-body-sm text-on-surface-variant font-semibold">
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status / Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <h2 className="text-h3 font-h3 font-bold text-on-surface">
            Academic Operations
          </h2>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant leading-relaxed font-medium">
            Manage master data entities, assign faculties to sections, and track timetable calendars.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="rounded bg-secondary-container px-3 py-1.5 text-label-sm font-label-sm text-on-secondary-container">
              Active Term: Fall 2026
            </span>
            <span className="rounded bg-emerald-50 px-3 py-1.5 text-label-sm font-label-sm text-emerald-700 font-semibold dark:bg-emerald-950/20 dark:text-emerald-400">
              System Status: Operational
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <h2 className="text-h3 font-h3 font-bold text-on-surface">
            Identity & Authentication
          </h2>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant leading-relaxed font-medium">
            User accounts are synced dynamically with Clerk. System roles govern workspace layout accessibility.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="rounded bg-indigo-50 px-3 py-1.5 text-label-sm font-label-sm text-indigo-700 font-semibold dark:bg-indigo-950/20 dark:text-indigo-400">
              Provider: Clerk Auth
            </span>
            <span className="rounded bg-amber-50 px-3 py-1.5 text-label-sm font-label-sm text-amber-700 font-semibold dark:bg-amber-950/20 dark:text-amber-400">
              Database: PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
