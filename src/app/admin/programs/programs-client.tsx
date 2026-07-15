"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, BookOpen, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { createProgram, updateProgram, deleteProgram } from "./actions";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  departmentId: z.string().min(1, "Department is required"),
  durationYears: z.coerce.number().int().min(1).max(6),
  totalSemesters: z.coerce.number().int().min(1).max(12),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type FormValues = z.infer<typeof schema>;

interface Department { id: string; name: string; code: string }
interface Program { id: string; name: string; code: string; departmentId: string; department: { name: string; code: string }; durationYears: number; totalSemesters: number; description: string | null; status: string }

interface Props {
  initialPrograms: Program[];
  departments: Department[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialPage: number;
  activeCount: number; inactiveCount: number;
}

export function ProgramsClient({ initialPrograms, departments, totalPages, totalCount, initialSearch, initialPage, activeCount, inactiveCount }: Props) {
  const [programs] = React.useState(initialPrograms);
  const [search, setSearch] = React.useState(initialSearch);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<Program | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Program | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", code: "", departmentId: "", durationYears: 4, totalSemesters: 8, description: "", status: "ACTIVE" } });

  const openEdit = (p: Program) => { setEditItem(p); form.reset({ name: p.name, code: p.code, departmentId: p.departmentId, durationYears: p.durationYears, totalSemesters: p.totalSemesters, description: p.description || "", status: p.status as "ACTIVE" | "INACTIVE" }); };
  const openAdd = () => { setEditItem(null); form.reset({ name: "", code: "", departmentId: "", durationYears: 4, totalSemesters: 8, description: "", status: "ACTIVE" }); setShowAdd(true); };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) { await updateProgram(editItem.id, data); showToast("Program updated"); setEditItem(null); }
      else { await createProgram(data); showToast("Program created"); setShowAdd(false); }
      window.location.reload();
    } catch { showToast("Failed to save", "error"); }
    finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteProgram(deleteItem.id); showToast("Program deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); }
    finally { setLoading(false); }
  };

  const statusBadge = (status: string) => status === "ACTIVE"
    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle className="h-3 w-3" />Active</span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"><XCircle className="h-3 w-3" />Inactive</span>;

  const isDialogOpen = showAdd || !!editItem;

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-tight text-on-surface">Academic Programs</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} programs across all departments</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: "Total Programs", value: totalCount, icon: BookOpen, color: "text-[#0058be] bg-[#0058be]/10" }, { label: "Active", value: activeCount, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" }, { label: "Inactive", value: inactiveCount, icon: XCircle, color: "text-red-500 bg-red-50" }].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span>
              <div className={`rounded-md p-2 ${s.color}`}><s.icon className="h-4 w-4" /></div>
            </div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-on-surface-variant" />
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && (window.location.href = `/admin/programs?search=${search}&page=1`)} placeholder="Search programs by name or code…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>{["Code", "Program Name", "Department", "Duration", "Semesters", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {programs.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-on-surface-variant">No programs found.</td></tr>
              ) : programs.map(p => (
                <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3"><span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">{p.code}</span></td>
                  <td className="px-4 py-3 font-medium text-on-surface">{p.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.department.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.durationYears} yrs</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.totalSemesters}</td>
                  <td className="px-4 py-3">{statusBadge(p.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteItem(p)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => window.location.href = `/admin/programs?search=${search}&page=${page - 1}`} className="rounded-md border border-outline-variant p-1.5 text-on-surface-variant disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => window.location.href = `/admin/programs?search=${search}&page=${page + 1}`} className="rounded-md border border-outline-variant p-1.5 text-on-surface-variant disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4">
              <h2 className="text-lg font-bold text-on-surface">{editItem ? "Edit Program" : "Add Program"}</h2>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Program Name *</label>
                  <input {...form.register("name")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none" />
                  {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Code *</label>
                  <input {...form.register("code")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none" />
                  {form.formState.errors.code && <p className="mt-1 text-xs text-red-500">{form.formState.errors.code.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Department *</label>
                <select {...form.register("departmentId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none">
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
                </select>
                {form.formState.errors.departmentId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.departmentId.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Duration (Years) *</label>
                  <input type="number" min={1} max={6} {...form.register("durationYears")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Total Semesters *</label>
                  <input type="number" min={1} max={12} {...form.register("totalSemesters")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Description</label>
                <textarea {...form.register("description")} rows={2} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Status</label>
                <select {...form.register("status")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-60 transition-colors">{loading ? "Saving…" : editItem ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            <h2 className="text-lg font-bold text-on-surface">Delete Program</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Are you sure you want to delete <strong>{deleteItem.name}</strong>? This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteItem(null)} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container">Cancel</button>
              <button onClick={onDelete} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{loading ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
