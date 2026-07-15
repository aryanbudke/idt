import React from "react";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";

const SUBJECTS = [
  { code: "CS101", name: "Introduction to Programming", faculty: "Dr. Sarah Mitchell", totalClasses: 30, attended: 26 },
  { code: "CS102", name: "Data Structures", faculty: "Prof. Robert Chen", totalClasses: 28, attended: 22 },
  { code: "MATH201", name: "Discrete Mathematics", faculty: "Dr. James Wilson", totalClasses: 32, attended: 30 },
  { code: "CS103", name: "Digital Logic Design", faculty: "Dr. Emma Brown", totalClasses: 24, attended: 18 },
];

const RECENT = [
  { date: "Mon, Oct 14", subject: "CS101", status: "PRESENT" },
  { date: "Mon, Oct 14", subject: "CS102", status: "ABSENT" },
  { date: "Tue, Oct 15", subject: "MATH201", status: "PRESENT" },
  { date: "Tue, Oct 15", subject: "CS103", status: "PRESENT" },
  { date: "Wed, Oct 16", subject: "CS101", status: "ABSENT" },
];

export default function StudentAttendancePage() {
  const overall = SUBJECTS.reduce((a, s) => a + s.attended, 0);
  const totalClasses = SUBJECTS.reduce((a, s) => a + s.totalClasses, 0);
  const overallPct = Math.round((overall / totalClasses) * 100);

  return (
    <div className="space-y-6">
      <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Attendance</h1><p className="mt-1 text-body-sm text-on-surface-variant">Fall 2024 attendance summary</p></div>

      {/* Overall */}
      <div className={`rounded-xl border p-5 shadow-sm ${overallPct >= 75 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${overallPct >= 75 ? "text-emerald-700" : "text-red-700"}`}>Overall Attendance</p>
            <p className={`text-4xl font-bold mt-1 ${overallPct >= 75 ? "text-emerald-800" : "text-red-800"}`}>{overallPct}%</p>
            <p className={`text-xs mt-1 ${overallPct >= 75 ? "text-emerald-600" : "text-red-600"}`}>{overall} of {totalClasses} classes attended {overallPct >= 75 ? "✓ Good Standing" : "⚠ Below 75% threshold"}</p>
          </div>
          <div className={`h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold ${overallPct >= 75 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{overallPct}%</div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="border-b border-outline-variant px-6 py-4 flex items-center gap-2"><BookOpen className="h-4 w-4 text-on-surface-variant" /><h2 className="font-semibold text-on-surface">Subject-wise Attendance</h2></div>
        <div className="divide-y divide-outline-variant">
          {SUBJECTS.map(s => {
            const pct = Math.round((s.attended / s.totalClasses) * 100);
            return (
              <div key={s.code} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div><span className="rounded bg-secondary-container px-1.5 py-0.5 text-xs font-bold text-on-secondary-container">{s.code}</span><p className="mt-1 text-sm font-medium text-on-surface">{s.name}</p><p className="text-xs text-on-surface-variant">{s.faculty}</p></div>
                  <div className="text-right shrink-0 ml-4">
                    <p className={`text-lg font-bold ${pct >= 75 ? "text-emerald-700" : "text-red-600"}`}>{pct}%</p>
                    <p className="text-xs text-on-surface-variant">{s.attended}/{s.totalClasses}</p>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 75 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Records */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="border-b border-outline-variant px-6 py-4"><h2 className="font-semibold text-on-surface">Recent Records</h2></div>
        <div className="divide-y divide-outline-variant">
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3">
              <div><p className="text-sm font-medium text-on-surface">{r.subject}</p><p className="text-xs text-on-surface-variant">{r.date}</p></div>
              {r.status === "PRESENT" ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle className="h-3 w-3" />Present</span> : <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"><XCircle className="h-3 w-3" />Absent</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
