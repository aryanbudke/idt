"use client";

import React from "react";
import { Plus, FileEdit, Clock, Users } from "lucide-react";

const ASSIGNMENTS = [
  { id: "a1", title: "Assignment 1: Bubble Sort vs Quick Sort", subject: "Data Structures", section: "Section B", uploadDate: "Oct 01, 2024", deadline: "Oct 20, 2024", submissions: 42, total: 55, status: "Active" },
  { id: "a2", title: "Lab Report 3: Binary Trees", subject: "Data Structures", section: "Section B", uploadDate: "Oct 07, 2024", deadline: "Oct 25, 2024", submissions: 30, total: 55, status: "Active" },
  { id: "a3", title: "Project Proposal: Algorithm Design", subject: "Algorithms", section: "Section A", uploadDate: "Sep 20, 2024", deadline: "Nov 01, 2024", submissions: 58, total: 60, status: "Active" },
  { id: "a4", title: "Assignment 2: Recursion Problems", subject: "Intro to Programming", section: "Section A", uploadDate: "Oct 10, 2024", deadline: "Oct 31, 2024", submissions: 55, total: 58, status: "Active" },
];

export default function FacultyAssignmentsPage() {
  const [showCreate, setShowCreate] = React.useState(false);

  return (
    <div className="space-y-6">
      {showCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4"><h2 className="text-lg font-bold text-on-surface">Create Assignment</h2></div>
            <div className="space-y-4 p-6">
              {[{ label: "Title", ph: "Assignment title" }, { label: "Description", ph: "Brief description", textarea: true }, { label: "Deadline", ph: "", type: "date" }].map(f => (
                <div key={f.label}><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">{f.label}</label>
                  {f.textarea ? <textarea rows={3} placeholder={f.ph} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                    : <input type={f.type || "text"} placeholder={f.ph} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />}
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Assignments</h1><p className="mt-1 text-body-sm text-on-surface-variant">{ASSIGNMENTS.length} active assignments</p></div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Create Assignment</button>
      </div>
      <div className="grid gap-4">
        {ASSIGNMENTS.map(a => {
          const pct = Math.round((a.submissions / a.total) * 100);
          return (
            <div key={a.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">{a.subject}</span>
                    <span className="text-xs text-on-surface-variant">{a.section}</span>
                  </div>
                  <h3 className="font-semibold text-on-surface">{a.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1"><FileEdit className="h-3.5 w-3.5" />Posted {a.uploadDate}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Due {a.deadline}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{a.submissions}/{a.total} submitted</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full max-w-xs rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant">{pct}% submission rate</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shrink-0">{a.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
