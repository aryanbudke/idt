"use client";

import React from "react";
import { CheckCircle, XCircle, Users } from "lucide-react";

const SESSIONS = [
  { id: "s1", subject: "Introduction to Programming", section: "Section A", date: "Mon, Oct 14, 2024", time: "10:00 – 11:00", students: [
    { id: "1", name: "Alice Johnson", rollNo: "CS001", present: true },
    { id: "2", name: "Bob Martinez", rollNo: "CS002", present: false },
    { id: "3", name: "Carol Lee", rollNo: "CS003", present: true },
    { id: "4", name: "David Kim", rollNo: "CS004", present: true },
    { id: "5", name: "Emma Brown", rollNo: "CS005", present: false },
  ]},
];

export default function FacultyAttendancePage() {
  const [session] = React.useState(SESSIONS[0]);
  const [attendance, setAttendance] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(session.students.map(s => [s.id, s.present]))
  );
  const [saved, setSaved] = React.useState(false);

  const toggle = (id: string) => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = session.students.length;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      {saved && <div className="fixed top-4 right-4 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">Attendance saved!</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Attendance Tracking</h1><p className="mt-1 text-body-sm text-on-surface-variant">Mark attendance for today&apos;s sessions</p></div>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors">Save Attendance</button>
      </div>

      {/* Session Info Card */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-on-surface">{session.subject}</h2>
            <p className="text-sm text-on-surface-variant">{session.section} · {session.date} · {session.time}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-700"><CheckCircle className="h-4 w-4" />{presentCount} Present</span>
            <span className="flex items-center gap-1.5 text-red-600"><XCircle className="h-4 w-4" />{totalCount - presentCount} Absent</span>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-surface-container overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(presentCount / totalCount) * 100}%` }} />
        </div>
        <p className="mt-1 text-xs text-on-surface-variant text-right">{Math.round((presentCount / totalCount) * 100)}% attendance</p>
      </div>

      {/* Student List */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="border-b border-outline-variant px-6 py-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-on-surface-variant" />
          <h2 className="font-semibold text-on-surface">{totalCount} Students</h2>
        </div>
        <div className="divide-y divide-outline-variant">
          {session.students.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-3 hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.name.split(" ").map(n => n[0]).join("")}</div>
                <div><p className="text-sm font-medium text-on-surface">{s.name}</p><p className="text-xs text-on-surface-variant">{s.rollNo}</p></div>
              </div>
              <button onClick={() => toggle(s.id)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${attendance[s.id] ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                {attendance[s.id] ? <><CheckCircle className="h-3.5 w-3.5" />Present</> : <><XCircle className="h-3.5 w-3.5" />Absent</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
