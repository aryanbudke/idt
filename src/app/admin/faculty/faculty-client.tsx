"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, Users, CheckCircle, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { createFacultyMember, updateFacultyMember, deleteFacultyMember } from "./actions";

const schema = z.object({
  facultyId: z.string().min(1, "Faculty ID required"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone required"),
  designation: z.string().min(1, "Designation required"),
  departmentId: z.string().min(1, "Department required"),
  joiningDate: z.string().min(1, "Joining date required"),
  status: z.enum(["ACTIVE", "ON_LEAVE", "RESIGNED"]),
});
type FormValues = z.infer<typeof schema>;

interface Department { id: string; name: string; code: string }
interface Faculty { id: string; facultyId: string; firstName: string; lastName: string; email: string; phone: string; designation: string; departmentId: string; department: { name: string; code: string }; joiningDate: Date | string; profileImageUrl: string | null; status: string }

interface Props {
  initialFaculty: Faculty[];
  departments: Department[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialDept: string; initialPage: number;
  activeCount: number; onLeaveCount: number;
}

export function FacultyClient({ initialFaculty, departments, totalPages, totalCount, initialSearch, initialDept, initialPage, activeCount, onLeaveCount }: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [dept, setDept] = React.useState(initialDept);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<Faculty | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Faculty | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { facultyId: "", firstName: "", lastName: "", email: "", phone: "", designation: "", departmentId: "", joiningDate: "", status: "ACTIVE" } });

  const navigate = () => window.location.href = `/admin/faculty?search=${search}&dept=${dept}&page=1`;
  const openEdit = (f: Faculty) => {
    setEditItem(f);
    const jd = typeof f.joiningDate === "string" ? f.joiningDate.slice(0, 10) : new Date(f.joiningDate).toISOString().slice(0, 10);
    form.reset({ facultyId: f.facultyId, firstName: f.firstName, lastName: f.lastName, email: f.email, phone: f.phone, designation: f.designation, departmentId: f.departmentId, joiningDate: jd, status: f.status as "ACTIVE" | "ON_LEAVE" | "RESIGNED" });
  };
  const openAdd = () => { setEditItem(null); form.reset({ facultyId: `FAC-${Date.now().toString().slice(-4)}`, firstName: "", lastName: "", email: "", phone: "", designation: "Assistant Professor", departmentId: "", joiningDate: new Date().toISOString().slice(0, 10), status: "ACTIVE" }); setShowAdd(true); };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) { await updateFacultyMember(editItem.id, data); showToast("Faculty updated"); setEditItem(null); }
      else { await createFacultyMember(data); showToast("Faculty created"); setShowAdd(false); }
      window.location.reload();
    } catch { showToast("Failed to save", "error"); } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteFacultyMember(deleteItem.id); showToast("Faculty deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { ACTIVE: "bg-emerald-50 text-emerald-700", ON_LEAVE: "bg-amber-50 text-amber-700", RESIGNED: "bg-red-50 text-red-600" };
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${map[s] || map.ACTIVE}`}>{s.replace("_", " ")}</span>;
  };

  const isDialogOpen = showAdd || !!editItem;

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.msg}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Faculty Management</h1><p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} faculty members registered</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Faculty</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: "Total Faculty", value: totalCount, color: "text-[#0058be] bg-[#0058be]/10", Icon: Users }, { label: "Active", value: activeCount, color: "text-emerald-600 bg-emerald-50", Icon: CheckCircle }, { label: "On Leave", value: onLeaveCount, color: "text-amber-600 bg-amber-50", Icon: Users }].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span><div className={`rounded-md p-2 ${s.color}`}><s.Icon className="h-4 w-4" /></div></div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-on-surface-variant" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && navigate()} placeholder="Search faculty by name, ID, or email…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 shadow-sm">
          <Filter className="h-4 w-4 text-on-surface-variant" />
          <select value={dept} onChange={e => { setDept(e.target.value); window.location.href = `/admin/faculty?search=${search}&dept=${e.target.value}&page=1`; }} className="bg-transparent text-sm text-on-surface outline-none">
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>{["ID", "Name", "Department", "Designation", "Email", "Status", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {initialFaculty.length === 0 ? <tr><td colSpan={7} className="py-16 text-center text-on-surface-variant">No faculty members found.</td></tr>
                : initialFaculty.map(f => (
                  <tr key={f.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3"><span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">{f.facultyId}</span></td>
                    <td className="px-4 py-3 font-medium text-on-surface">{f.firstName} {f.lastName}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{f.department.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{f.designation}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{f.email}</td>
                    <td className="px-4 py-3">{statusBadge(f.status)}</td>
                    <td className="px-4 py-3"><div className="flex gap-2">
                      <button onClick={() => openEdit(f)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteItem(f)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => window.location.href = `/admin/faculty?search=${search}&dept=${dept}&page=${page - 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => window.location.href = `/admin/faculty?search=${search}&dept=${dept}&page=${page + 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4"><h2 className="text-lg font-bold text-on-surface">{editItem ? "Edit Faculty Member" : "Add Faculty Member"}</h2></div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Faculty ID *</label><input {...form.register("facultyId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">First Name *</label><input {...form.register("firstName")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Last Name *</label><input {...form.register("lastName")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Email *</label><input type="email" {...form.register("email")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />{form.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>}</div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Phone *</label><input {...form.register("phone")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Designation *</label><input {...form.register("designation")} placeholder="e.g. Assistant Professor" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Department *</label>
                  <select {...form.register("departmentId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  {form.formState.errors.departmentId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.departmentId.message}</p>}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Status</label><select {...form.register("status")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"><option value="ACTIVE">Active</option><option value="ON_LEAVE">On Leave</option><option value="RESIGNED">Resigned</option></select></div>
              </div>
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
            <h2 className="text-lg font-bold text-on-surface">Delete Faculty Member</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Delete <strong>{deleteItem.firstName} {deleteItem.lastName}</strong>? This cannot be undone.</p>
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
