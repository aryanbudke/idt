import React from "react";
import { BookOpen, Users, Clock } from "lucide-react";

const subjects = [
  { code: "CS101", name: "Introduction to Programming", semester: "Sem 1", section: "Section A", students: 58, schedule: "Mon, Wed 10:00–11:00", credits: 4 },
  { code: "CS102", name: "Data Structures", semester: "Sem 1", section: "Section B", students: 55, schedule: "Tue, Thu 12:00–13:00", credits: 4 },
  { code: "CS201", name: "Algorithms", semester: "Sem 2", section: "Section A", students: 60, schedule: "Mon, Wed, Fri 14:00–15:00", credits: 3 },
  { code: "CS301", name: "Database Systems", semester: "Sem 3", section: "Section A", students: 52, schedule: "Tue, Thu 16:00–17:00", credits: 3 },
];

export default function FacultySubjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold tracking-tight text-on-surface">Assigned Subjects</h1>
        <p className="mt-1 text-body-sm text-on-surface-variant">{subjects.length} subjects assigned for this semester</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: "Total Subjects", value: subjects.length, Icon: BookOpen }, { label: "Total Students", value: subjects.reduce((a, s) => a + s.students, 0), Icon: Users }, { label: "Teaching Hours / Week", value: `${subjects.length * 3}h`, Icon: Clock }].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span><div className="rounded-md bg-[#0058be]/10 p-2 text-[#0058be]"><s.Icon className="h-4 w-4" /></div></div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s) => (
          <div key={s.code} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">{s.code}</span>
              <span className="text-xs text-on-surface-variant">{s.credits} credits</span>
            </div>
            <h3 className="mt-2 font-semibold text-on-surface">{s.name}</h3>
            <div className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex gap-2"><Users className="h-3.5 w-3.5 shrink-0" />{s.students} students · {s.section}</div>
              <div className="flex gap-2"><Clock className="h-3.5 w-3.5 shrink-0" />{s.schedule}</div>
              <div className="flex gap-2"><BookOpen className="h-3.5 w-3.5 shrink-0" />{s.semester}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
