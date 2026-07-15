import React from "react";
import { Megaphone } from "lucide-react";

const ANNOUNCEMENTS = [
  { id: "1", title: "Mid-Term Exam Schedule Released", description: "The mid-term examination schedule for all programs has been released. Students are advised to review and plan accordingly.", audience: "ALL", publishDate: "Oct 01, 2024", expiryDate: "Nov 30, 2024" },
  { id: "2", title: "Faculty Development Workshop", description: "A workshop on modern pedagogy will be held for all faculty members on 20th October. Attendance is mandatory.", audience: "FACULTY", publishDate: "Oct 10, 2024", expiryDate: "Oct 21, 2024" },
  { id: "3", title: "Research Submission Deadline", description: "All research papers for the annual faculty symposium must be submitted by October 31st.", audience: "FACULTY", publishDate: "Oct 08, 2024", expiryDate: "Oct 31, 2024" },
];

const audienceColors: Record<string, string> = { ALL: "bg-blue-50 text-blue-700", STUDENT: "bg-emerald-50 text-emerald-700", FACULTY: "bg-violet-50 text-violet-700", ADMIN: "bg-amber-50 text-amber-700" };

export default function FacultyAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Announcements</h1><p className="mt-1 text-body-sm text-on-surface-variant">{ANNOUNCEMENTS.length} active announcements</p></div>
      <div className="space-y-4">
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Megaphone className="h-4 w-4 text-primary" />
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${audienceColors[a.audience]}`}>{a.audience}</span>
            </div>
            <h3 className="font-semibold text-on-surface">{a.title}</h3>
            <p className="mt-1.5 text-sm text-on-surface-variant">{a.description}</p>
            <p className="mt-2 text-xs text-on-surface-variant">{a.publishDate} – {a.expiryDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
