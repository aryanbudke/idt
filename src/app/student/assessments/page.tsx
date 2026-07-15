import React from "react";
import { Award } from "lucide-react";

const ASSESSMENTS = [
  { subject: "CS101 – Intro to Programming", exams: [{ type: "IA1", marks: 18, total: 20, date: "Sep 05, 2024" }, { type: "IA2", marks: 17, total: 20, date: "Oct 10, 2024" }, { type: "Assignment", marks: 9, total: 10, date: "Sep 20, 2024" }] },
  { subject: "CS102 – Data Structures", exams: [{ type: "IA1", marks: 15, total: 20, date: "Sep 07, 2024" }, { type: "IA2", marks: 14, total: 20, date: "Oct 12, 2024" }, { type: "Lab", marks: 37, total: 40, date: "Oct 01, 2024" }] },
  { subject: "MATH201 – Discrete Mathematics", exams: [{ type: "IA1", marks: 19, total: 20, date: "Sep 06, 2024" }, { type: "IA2", marks: 18, total: 20, date: "Oct 11, 2024" }] },
];

const gradeColor: Record<string, string> = { "A+": "text-emerald-700 bg-emerald-50", A: "text-emerald-700 bg-emerald-50", B: "text-blue-700 bg-blue-50", C: "text-amber-700 bg-amber-50", F: "text-red-600 bg-red-50" };
const getGrade = (pct: number) => pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "F";

export default function StudentAssessmentsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Marks & Assessments</h1><p className="mt-1 text-body-sm text-on-surface-variant">Internal Assessment results – Fall 2024</p></div>

      <div className="space-y-4">
        {ASSESSMENTS.map(a => {
          const totalMarks = a.exams.reduce((s, e) => s + e.marks, 0);
          const maxMarks = a.exams.reduce((s, e) => s + e.total, 0);
          const pct = Math.round((totalMarks / maxMarks) * 100);
          const grade = getGrade(pct);
          return (
            <div key={a.subject} className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4">
                <div className="flex items-center gap-2"><Award className="h-4 w-4 text-primary" /><h2 className="font-semibold text-on-surface">{a.subject}</h2></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-on-surface-variant">{totalMarks}/{maxMarks}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${gradeColor[grade]}`}>{grade}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-outline-variant">
                    <tr>{["Exam Type", "Marks Obtained", "Total Marks", "Percentage", "Date"].map(h => <th key={h} className="px-4 py-2.5 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {a.exams.map(e => {
                      const ePct = Math.round((e.marks / e.total) * 100);
                      const eGrade = getGrade(ePct);
                      return (
                        <tr key={e.type} className="hover:bg-surface-container-low/50">
                          <td className="px-4 py-3 font-medium text-on-surface">{e.type}</td>
                          <td className="px-4 py-3 text-on-surface">{e.marks}</td>
                          <td className="px-4 py-3 text-on-surface-variant">{e.total}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-surface-container overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${ePct}%` }} /></div>
                              <span className="text-xs font-medium text-on-surface-variant">{ePct}%</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${gradeColor[eGrade]}`}>{eGrade}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-on-surface-variant">{e.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
