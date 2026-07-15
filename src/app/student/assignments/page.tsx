import React from "react";
import { FileEdit, Clock, CheckCircle, XCircle } from "lucide-react";

const ASSIGNMENTS = [
  { id: "1", title: "Assignment 1: Bubble Sort vs Quick Sort", subject: "CS102 – Data Structures", faculty: "Prof. Robert Chen", uploadDate: "Oct 01, 2024", deadline: "Oct 20, 2024", submitted: true, submittedDate: "Oct 18, 2024", marks: 9, total: 10 },
  { id: "2", title: "Lab Report 3: Binary Trees", subject: "CS102 – Data Structures", faculty: "Prof. Robert Chen", uploadDate: "Oct 07, 2024", deadline: "Oct 25, 2024", submitted: false, submittedDate: null, marks: null, total: 10 },
  { id: "3", title: "Project Proposal: Algorithm Design", subject: "CS201 – Algorithms", faculty: "Dr. Sarah Mitchell", uploadDate: "Sep 20, 2024", deadline: "Nov 01, 2024", submitted: true, submittedDate: "Sep 30, 2024", marks: null, total: 20 },
  { id: "4", title: "Math Problem Set 4", subject: "MATH201 – Discrete Mathematics", faculty: "Dr. James Wilson", uploadDate: "Oct 10, 2024", deadline: "Oct 31, 2024", submitted: false, submittedDate: null, marks: null, total: 15 },
];

const today = new Date();

export default function StudentAssignmentsPage() {
  const submitted = ASSIGNMENTS.filter(a => a.submitted).length;
  const pending = ASSIGNMENTS.length - submitted;

  return (
    <div className="space-y-6">
      <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Assignments</h1><p className="mt-1 text-body-sm text-on-surface-variant">Track your pending and submitted assignments</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: "Total", value: ASSIGNMENTS.length, color: "text-[#0058be] bg-[#0058be]/10" }, { label: "Submitted", value: submitted, color: "text-emerald-600 bg-emerald-50" }, { label: "Pending", value: pending, color: "text-amber-600 bg-amber-50" }].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span><div className={`rounded-md p-2 ${s.color}`}><FileEdit className="h-4 w-4" /></div></div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {ASSIGNMENTS.map(a => {
          const deadlineDate = new Date(a.deadline);
          const isOverdue = !a.submitted && deadlineDate < today;
          return (
            <div key={a.id} className={`rounded-xl border bg-surface-container-lowest p-5 shadow-sm ${isOverdue ? "border-red-200" : "border-outline-variant"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">{a.subject.split("–")[0].trim()}</span>
                    {isOverdue && <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">Overdue</span>}
                  </div>
                  <h3 className="font-semibold text-on-surface">{a.title}</h3>
                  <p className="mt-0.5 text-xs text-on-surface-variant">{a.subject} · {a.faculty}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1"><FileEdit className="h-3.5 w-3.5" />Posted {a.uploadDate}</span>
                    <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : ""}`}><Clock className="h-3.5 w-3.5" />Due {a.deadline}</span>
                    {a.submitted && a.submittedDate && <span className="flex items-center gap-1 text-emerald-700"><CheckCircle className="h-3.5 w-3.5" />Submitted {a.submittedDate}</span>}
                    {a.marks !== null && <span className="font-medium text-on-surface">Marks: {a.marks}/{a.total}</span>}
                  </div>
                </div>
                <div className="shrink-0">
                  {a.submitted
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><CheckCircle className="h-3.5 w-3.5" />Submitted</span>
                    : <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"><XCircle className="h-3.5 w-3.5" />Pending</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
