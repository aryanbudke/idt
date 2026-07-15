"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "./actions";

const schema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description required"),
  audience: z.enum(["ALL", "STUDENT", "FACULTY", "ADMIN"]),
  publishDate: z.string().min(1, "Publish date required"),
  expiryDate: z.string().min(1, "Expiry date required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type FormValues = z.infer<typeof schema>;

interface Announcement { id: string; title: string; description: string; audience: string; publishDate: Date | string; expiryDate: Date | string; status: string }

interface Props {
  initialAnnouncements: Announcement[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialPage: number;
}

const audienceColors: Record<string, string> = { ALL: "bg-blue-50 text-blue-700", STUDENT: "bg-emerald-50 text-emerald-700", FACULTY: "bg-violet-50 text-violet-700", ADMIN: "bg-amber-50 text-amber-700" };

export function AnnouncementsClient({ initialAnnouncements, totalPages, totalCount, initialSearch, initialPage }: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<Announcement | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Announcement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { title: "", description: "", audience: "ALL", publishDate: today, expiryDate: thirtyDays, status: "ACTIVE" } });

  const openEdit = (a: Announcement) => {
    setEditItem(a);
    form.reset({ title: a.title, description: a.description, audience: a.audience as FormValues["audience"], publishDate: new Date(a.publishDate).toISOString().slice(0, 10), expiryDate: new Date(a.expiryDate).toISOString().slice(0, 10), status: a.status as "ACTIVE" | "INACTIVE" });
  };
  const openAdd = () => { setEditItem(null); form.reset({ title: "", description: "", audience: "ALL", publishDate: today, expiryDate: thirtyDays, status: "ACTIVE" }); setShowAdd(true); };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) { await updateAnnouncement(editItem.id, data); showToast("Announcement updated"); setEditItem(null); }
      else { await createAnnouncement(data); showToast("Announcement created"); setShowAdd(false); }
      window.location.reload();
    } catch { showToast("Failed to save", "error"); } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteAnnouncement(deleteItem.id); showToast("Announcement deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  const isDialogOpen = showAdd || !!editItem;

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.msg}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Announcements</h1><p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} active announcements</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> New Announcement</button>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-on-surface-variant" />
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && (window.location.href = `/admin/announcements?search=${search}&page=1`)} placeholder="Search announcements…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
      </div>
      <div className="space-y-3">
        {initialAnnouncements.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-16 text-center shadow-sm"><Megaphone className="mx-auto h-12 w-12 text-on-surface-variant opacity-40" /><p className="mt-4 text-on-surface-variant">No announcements found.</p></div>
        ) : initialAnnouncements.map(a => (
          <div key={a.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${audienceColors[a.audience] || audienceColors.ALL}`}>{a.audience}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{a.status}</span>
                </div>
                <h3 className="font-semibold text-on-surface">{a.title}</h3>
                <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">{a.description}</p>
                <p className="mt-2 text-xs text-on-surface-variant">
                  {new Date(a.publishDate).toLocaleDateString()} – {new Date(a.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(a)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteItem(a)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => window.location.href = `/admin/announcements?search=${search}&page=${page - 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <button disabled={page >= totalPages} onClick={() => window.location.href = `/admin/announcements?search=${search}&page=${page + 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4"><h2 className="text-lg font-bold text-on-surface">{editItem ? "Edit Announcement" : "New Announcement"}</h2></div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Title *</label><input {...form.register("title")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />{form.formState.errors.title && <p className="mt-1 text-xs text-red-500">{form.formState.errors.title.message}</p>}</div>
              <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Description *</label><textarea rows={3} {...form.register("description")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />{form.formState.errors.description && <p className="mt-1 text-xs text-red-500">{form.formState.errors.description.message}</p>}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Audience</label><select {...form.register("audience")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"><option value="ALL">All</option><option value="STUDENT">Students</option><option value="FACULTY">Faculty</option><option value="ADMIN">Admin</option></select></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Status</label><select {...form.register("status")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Publish Date *</label><input type="date" {...form.register("publishDate")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Expiry Date *</label><input type="date" {...form.register("expiryDate")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-60">{loading ? "Saving…" : editItem ? "Update" : "Publish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            <h2 className="text-lg font-bold text-on-surface">Delete Announcement</h2>
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
