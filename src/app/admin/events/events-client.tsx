"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, CalendarDays, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { createEvent, updateEvent, deleteEvent } from "./actions";

const schema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description required"),
  category: z.string().min(1, "Category required"),
  venue: z.string().min(1, "Venue required"),
  eventDate: z.string().min(1, "Date required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  organizer: z.string().min(1, "Organizer required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type FormValues = z.infer<typeof schema>;

interface Event { id: string; title: string; description: string; category: string; venue: string; eventDate: Date | string; startTime: string; endTime: string; organizer: string; status: string }

interface Props {
  initialEvents: Event[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialPage: number;
}

const categoryColors: Record<string, string> = { Academic: "bg-blue-50 text-blue-700", Cultural: "bg-violet-50 text-violet-700", Sports: "bg-emerald-50 text-emerald-700", Tech: "bg-amber-50 text-amber-700" };

export function EventsClient({ initialEvents, totalPages, totalCount, initialSearch, initialPage }: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<Event | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Event | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { title: "", description: "", category: "Academic", venue: "", eventDate: today, startTime: "09:00", endTime: "17:00", organizer: "", status: "ACTIVE" } });

  const openEdit = (e: Event) => {
    setEditItem(e);
    form.reset({ title: e.title, description: e.description, category: e.category, venue: e.venue, eventDate: new Date(e.eventDate).toISOString().slice(0, 10), startTime: e.startTime, endTime: e.endTime, organizer: e.organizer, status: e.status as "ACTIVE" | "INACTIVE" });
  };
  const openAdd = () => { setEditItem(null); form.reset({ title: "", description: "", category: "Academic", venue: "", eventDate: today, startTime: "09:00", endTime: "17:00", organizer: "", status: "ACTIVE" }); setShowAdd(true); };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) { await updateEvent(editItem.id, data); showToast("Event updated"); setEditItem(null); }
      else { await createEvent(data); showToast("Event created"); setShowAdd(false); }
      window.location.reload();
    } catch { showToast("Failed to save", "error"); } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteEvent(deleteItem.id); showToast("Event deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  const isDialogOpen = showAdd || !!editItem;

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.msg}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Events</h1><p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} events scheduled</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Create Event</button>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-on-surface-variant" />
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && (window.location.href = `/admin/events?search=${search}&page=1`)} placeholder="Search events…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialEvents.length === 0 ? (
          <div className="col-span-full rounded-xl border border-outline-variant bg-surface-container-lowest p-16 text-center shadow-sm"><CalendarDays className="mx-auto h-12 w-12 text-on-surface-variant opacity-40" /><p className="mt-4 text-on-surface-variant">No events found.</p></div>
        ) : initialEvents.map(e => (
          <div key={e.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColors[e.category] || "bg-gray-100 text-gray-700"}`}>{e.category}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(e)} className="rounded-md p-1 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => setDeleteItem(e)} className="rounded-md p-1 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <h3 className="font-semibold text-on-surface leading-snug">{e.title}</h3>
            <p className="mt-1.5 text-xs text-on-surface-variant line-clamp-2">{e.description}</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant"><CalendarDays className="h-3.5 w-3.5" />{new Date(e.eventDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant"><Clock className="h-3.5 w-3.5" />{e.startTime} – {e.endTime}</div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant"><MapPin className="h-3.5 w-3.5" />{e.venue}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => window.location.href = `/admin/events?search=${search}&page=${page - 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <button disabled={page >= totalPages} onClick={() => window.location.href = `/admin/events?search=${search}&page=${page + 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4"><h2 className="text-lg font-bold text-on-surface">{editItem ? "Edit Event" : "Create Event"}</h2></div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
              <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Title *</label><input {...form.register("title")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Description *</label><textarea rows={3} {...form.register("description")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Category *</label><input list="categories" {...form.register("category")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /><datalist id="categories"><option value="Academic"/><option value="Cultural"/><option value="Sports"/><option value="Tech"/><option value="Workshop"/></datalist></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Venue *</label><input {...form.register("venue")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Date *</label><input type="date" {...form.register("eventDate")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Start Time *</label><input type="time" {...form.register("startTime")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">End Time *</label><input type="time" {...form.register("endTime")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Organizer *</label><input {...form.register("organizer")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Status</label><select {...form.register("status")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-60">{loading ? "Saving…" : editItem ? "Update" : "Create Event"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            <h2 className="text-lg font-bold text-on-surface">Delete Event</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Delete <strong>{deleteItem.title}</strong>? This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteItem(null)} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container">Cancel</button>
              <button onClick={onDelete} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{loading ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
