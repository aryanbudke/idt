"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { createSection, updateSection, deleteSection } from "./actions";

const schema = z.object({
  semesterId: z.string().min(1, "Semester is required"),
  name: z.string().min(1, "Section name is required"),
  capacity: z.coerce.number().int().min(1).max(200),
});
type FormValues = z.infer<typeof schema>;

interface SemesterItem { id: string; semesterNumber: number; academicYear: string; program: { name: string; code: string } }
interface Section { id: string; semesterId: string; semester: { semesterNumber: number; academicYear: string; program: { name: string; code: string } }; name: string; capacity: number }

interface Props {
  initialSections: Section[];
  semesters: SemesterItem[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialPage: number;
}

export function SectionsClient({ initialSections, semesters, totalPages, totalCount, initialSearch, initialPage }: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<Section | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Section | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { semesterId: "", name: "Section A", capacity: 60 } });

  const openEdit = (s: Section) => { setEditItem(s); form.reset({ semesterId: s.semesterId, name: s.name, capacity: s.capacity }); };
  const openAdd = () => { setEditItem(null); form.reset({ semesterId: "", name: "Section A", capacity: 60 }); setShowAdd(true); };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) { await updateSection(editItem.id, data); showToast("Section updated"); setEditItem(null); }
      else { await createSection(data); showToast("Section created"); setShowAdd(false); }
      window.location.reload();
    } catch { showToast("Failed to save", "error"); } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteSection(deleteItem.id); showToast("Section deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  const isDialogOpen = showAdd || !!editItem;

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.msg}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Sections</h1><p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} sections registered</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Section</button>
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm flex items-center gap-4">
        <div className={`rounded-md p-2.5 text-[#0058be] bg-[#0058be]/10`}><LayoutGrid className="h-5 w-5" /></div>
        <div><p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Total Sections</p><p className="text-3xl font-bold text-on-surface">{totalCount}</p></div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-on-surface-variant" />
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && (window.location.href = `/admin/sections?search=${search}&page=1`)} placeholder="Search sections by name…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>{["Section Name", "Semester", "Academic Year", "Capacity", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {initialSections.length === 0 ? <tr><td colSpan={5} className="py-16 text-center text-on-surface-variant">No sections found.</td></tr>
                : initialSections.map(s => (
                  <tr key={s.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface">{s.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant">Sem {s.semester.semesterNumber} · {s.semester.program.code}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{s.semester.academicYear}</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">{s.capacity} students</span></td>
                    <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(s)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button><button onClick={() => setDeleteItem(s)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => window.location.href = `/admin/sections?search=${search}&page=${page - 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => window.location.href = `/admin/sections?search=${search}&page=${page + 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4"><h2 className="text-lg font-bold text-on-surface">{editItem ? "Edit Section" : "Add Section"}</h2></div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Semester *</label>
                <select {...form.register("semesterId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="">Select semester</option>
                  {semesters.map(s => <option key={s.id} value={s.id}>Sem {s.semesterNumber} · {s.program.code} · {s.academicYear}</option>)}
                </select>
                {form.formState.errors.semesterId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.semesterId.message}</p>}
              </div>
              <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Section Name *</label><input {...form.register("name")} placeholder="e.g. Section A" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />{form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}</div>
              <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Capacity *</label><input type="number" min={1} {...form.register("capacity")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-60">{loading ? "Saving…" : editItem ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            <h2 className="text-lg font-bold text-on-surface">Delete Section</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Delete <strong>{deleteItem.name}</strong>? This cannot be undone.</p>
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
