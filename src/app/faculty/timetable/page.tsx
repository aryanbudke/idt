import React from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const SCHEDULE: Record<string, Record<string, { subject: string; section: string; room: string } | null>> = {
  Monday: { "10:00": { subject: "Intro to Programming", section: "Sec A", room: "101" }, "14:00": { subject: "Data Structures", section: "Sec B", room: "201" } },
  Tuesday: { "12:00": { subject: "Algorithms", section: "Sec A", room: "LAB-01" }, "16:00": { subject: "Database Systems", section: "Sec A", room: "102" } },
  Wednesday: { "10:00": { subject: "Intro to Programming", section: "Sec A", room: "101" }, "14:00": { subject: "Data Structures", section: "Sec B", room: "201" } },
  Thursday: { "12:00": { subject: "Algorithms", section: "Sec A", room: "LAB-01" }, "16:00": { subject: "Database Systems", section: "Sec A", room: "102" } },
  Friday: { "10:00": { subject: "Intro to Programming", section: "Sec A", room: "101" } },
};

const COLORS = ["bg-blue-50 border-blue-200 text-blue-800", "bg-violet-50 border-violet-200 text-violet-800", "bg-emerald-50 border-emerald-200 text-emerald-800", "bg-amber-50 border-amber-200 text-amber-800"];
const subjectColorMap: Record<string, string> = {};
let colorIdx = 0;
const getColor = (subject: string) => { if (!subjectColorMap[subject]) { subjectColorMap[subject] = COLORS[colorIdx % COLORS.length]; colorIdx++; } return subjectColorMap[subject]; };

export default function FacultyTimetablePage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Timetable & Schedule</h1><p className="mt-1 text-body-sm text-on-surface-variant">Your weekly teaching schedule for Fall 2024</p></div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant w-20">Time</th>
                {DAYS.map(d => <th key={d} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {PERIODS.map(time => (
                <tr key={time} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium text-on-surface-variant whitespace-nowrap">{time}</td>
                  {DAYS.map(day => {
                    const slot = SCHEDULE[day]?.[time];
                    return (
                      <td key={day} className="px-2 py-2">
                        {slot ? (
                          <div className={`rounded-lg border p-2.5 text-xs ${getColor(slot.subject)}`}>
                            <p className="font-semibold leading-tight">{slot.subject}</p>
                            <p className="mt-1 opacity-75">{slot.section} · {slot.room}</p>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
