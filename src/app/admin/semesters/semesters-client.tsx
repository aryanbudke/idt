"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, Calendar, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { createSemester, updateSemester, deleteSemester } from "./actions";

const schema = z.object({
  programId: z.string().min(1, "Program is required"),
  semesterNumber: z.coerce.number().int().min(1).max(12),
  academicYear: z.string().min(4, "Academic year is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type FormValues = z.infer<typeof schema>;

interface ProgramItem { id: string; name: string; code: string; totalSemesters: number }
interface Semester { id: string; programId: string; program: { name: string; code: string }; semesterNumber: number; academicYear: string; status: string }

interface Props {
  initialSemesters: Semester[];
  programs: ProgramItem[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialPage: number;
  activeCount: number;
}

export function SemestersClient({ initialSemesters, programs, totalPages, totalCount, initialSearch, initialPage, activeCount }: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<Semester | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Semester | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { programId: "", semesterNumber: 1, academicYear: "2024-25", status: "ACTIVE" } });

  const openEdit = (s: Semester) => { setEditItem(s); form.reset({ programId: s.programId, semesterNumber: s.semesterNumber, academicYear: s.academicYear, status: s.status as "ACTIVE" | "INACTIVE" }); };
  const openAdd = () => { setEditItem(null); form.reset({ programId: "", semesterNumber: 1, academicYear: "2024-25", status: "ACTIVE" }); setShowAdd(true); };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) { await updateSemester(editItem.id, data); showToast("Semester updated"); setEditItem(null); }
      else { await createSemester(data); showToast("Semester created"); setShowAdd(false); }
      window.location.reload();
    } catch { showToast("Failed to save", "error"); } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteSemester(deleteItem.id); showToast("Semester deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  const isDialogOpen = showAdd || !!editItem;

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.msg}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-tight text-on-surface">Semesters</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} semesters registered</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Semester
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[{ label: "Total Semesters", value: totalCount, color: "text-[#0058be] bg-[#0058be]/10" }, { label: "Active", value: activeCount, color: "text-emerald-600 bg-emerald-50" }].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span>
              <div className={`rounded-md p-2 ${s.color}`}><Calendar className="h-4 w-4" /></div>
            </div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-on-surface-variant" />
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && (window.location.href = `/admin/semesters?search=${search}&page=1`)} placeholder="Search by program or academic year…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>{["Semester No.", "Program", "Academic Year", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {initialSemesters.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-on-surface-variant">No semesters found.</td></tr>
              ) : initialSemesters.map(s => (
                <tr key={s.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{s.semesterNumber}</span></td>
                  <td className="px-4 py-3 font-medium text-on-surface">{s.program.name} <span className="ml-1 text-xs text-on-surface-variant">({s.program.code})</span></td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.academicYear}</td>
                  <td className="px-4 py-3">{s.status === "ACTIVE" ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle className="h-3 w-3" />Active</span> : <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"><XCircle className="h-3 w-3" />Inactive</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteItem(s)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => window.location.href = `/admin/semesters?search=${search}&page=${page - 1}`} className="rounded-md border border-outline-variant p-1.5 text-on-surface-variant disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => window.location.href = `/admin/semesters?search=${search}&page=${page + 1}`} className="rounded-md border border-outline-variant p-1.5 text-on-surface-variant disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4"><h2 className="text-lg font-bold text-on-surface">{editItem ? "Edit Semester" : "Add Semester"}</h2></div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Program *</label>
                <select {...form.register("programId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none">
                  <option value="">Select program</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                </select>
                {form.formState.errors.programId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.programId.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Semester Number *</label>
                  <input type="number" min={1} max={12} {...form.register("semesterNumber")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Academic Year *</label>
                  <input placeholder="e.g. 2024-25" {...form.register("academicYear")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  {form.formState.errors.academicYear && <p className="mt-1 text-xs text-red-500">{form.formState.errors.academicYear.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Status</label>
                <select {...form.register("status")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-60">{loading ? "Saving…" : editItem ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            <h2 className="text-lg font-bold text-on-surface">Delete Semester</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Delete Semester {deleteItem.semesterNumber} — {deleteItem.program.name} ({deleteItem.academicYear})?</p>
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
