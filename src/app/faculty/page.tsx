import React from "react";
import { GraduationCap, BookOpen, CheckSquare, Award } from "lucide-react";

export default function FacultyDashboard() {
  const stats = [
    { label: "Assigned Subjects", value: "4", icon: BookOpen, change: "This semester" },
    { label: "Total Students", value: "240", icon: GraduationCap, change: "Across 4 sections" },
    { label: "Pending Attendance", value: "2", icon: CheckSquare, change: "Sessions to mark" },
    { label: "Upcoming Exams", value: "3", icon: Award, change: "This month" },
  ];

  const recentSessions = [
    { subject: "Introduction to Programming", section: "Section A", date: "Today, 10:00 AM", students: 58, status: "Completed" },
    { subject: "Data Structures", section: "Section B", date: "Today, 12:00 PM", students: 55, status: "Pending" },
    { subject: "Algorithms", section: "Section A", date: "Yesterday, 2:00 PM", students: 60, status: "Completed" },
  ];

  const assignments = [
    { title: "Assignment 1: Sorting Algorithms", subject: "Data Structures", deadline: "Oct 20, 2024", submissions: 42, total: 55 },
    { title: "Lab Report 3: Binary Trees", subject: "Data Structures", deadline: "Oct 25, 2024", submissions: 30, total: 55 },
    { title: "Project Proposal", subject: "Algorithms", deadline: "Nov 01, 2024", submissions: 58, total: 60 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold tracking-tight text-on-surface">Faculty Dashboard</h1>
        <p className="mt-1 text-body-sm text-on-surface-variant font-medium">Welcome back! Here is your teaching overview for this semester.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span>
                <div className="rounded-md bg-[#0058be]/10 p-2.5 text-[#0058be]"><Icon className="h-5 w-5" /></div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-on-surface">{s.value}</span>
                <p className="mt-1.5 text-body-sm text-on-surface-variant font-medium">{s.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sessions */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="border-b border-outline-variant px-6 py-4"><h2 className="font-bold text-on-surface">Recent Sessions</h2></div>
          <div className="divide-y divide-outline-variant">
            {recentSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-sm text-on-surface">{s.subject}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{s.section} · {s.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-on-surface-variant">{s.students} students</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Tracker */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="border-b border-outline-variant px-6 py-4"><h2 className="font-bold text-on-surface">Assignment Tracker</h2></div>
          <div className="divide-y divide-outline-variant">
            {assignments.map((a, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="font-medium text-sm text-on-surface">{a.title}</p><p className="text-xs text-on-surface-variant mt-0.5">{a.subject} · Due {a.deadline}</p></div>
                  <span className="text-xs text-on-surface-variant shrink-0 ml-2">{a.submissions}/{a.total}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
