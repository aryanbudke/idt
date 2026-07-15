import React from "react";
import { CalendarDays, MapPin, Clock } from "lucide-react";

const EVENTS = [
  { id: "1", title: "Annual Cultural Fest", description: "A grand cultural festival featuring music, dance, drama and art exhibitions by students.", category: "Cultural", venue: "Main Auditorium", eventDate: "Nov 15, 2024", startTime: "10:00", endTime: "18:00", organizer: "Student Council" },
  { id: "2", title: "National Science Olympiad", description: "An inter-college science competition. Register your team by Oct 31.", category: "Academic", venue: "Science Block", eventDate: "Dec 05, 2024", startTime: "09:00", endTime: "17:00", organizer: "Science Department" },
  { id: "3", title: "Sports Day 2024", description: "Annual sports day with competitions in athletics, cricket, basketball and more.", category: "Sports", venue: "Sports Ground", eventDate: "Nov 30, 2024", startTime: "08:00", endTime: "16:00", organizer: "Sports Committee" },
  { id: "4", title: "Hackathon 2024", description: "24-hour coding competition open to all CS and IT students. Form teams of 3-4.", category: "Tech", venue: "Computer Lab Block", eventDate: "Nov 22, 2024", startTime: "09:00", endTime: "09:00", organizer: "Tech Club" },
];

const categoryColors: Record<string, string> = { Academic: "bg-blue-50 text-blue-700", Cultural: "bg-violet-50 text-violet-700", Sports: "bg-emerald-50 text-emerald-700", Tech: "bg-amber-50 text-amber-700" };

export default function StudentEventsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Events</h1><p className="mt-1 text-body-sm text-on-surface-variant">{EVENTS.length} upcoming events this semester</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {EVENTS.map(e => (
          <div key={e.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColors[e.category] || "bg-gray-100 text-gray-700"}`}>{e.category}</span>
            <h3 className="mt-3 font-semibold text-on-surface">{e.title}</h3>
            <p className="mt-1.5 text-xs text-on-surface-variant line-clamp-2">{e.description}</p>
            <div className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{e.eventDate}</div>
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{e.startTime} – {e.endTime}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{e.venue}</div>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">Organized by {e.organizer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
