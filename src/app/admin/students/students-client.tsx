"use client";

import * as React from "react";
import { Search, GraduationCap, ChevronLeft, ChevronRight, Filter, Trash2, CheckCircle } from "lucide-react";
import { deleteStudent } from "./actions";

interface Department { id: string; name: string; code: string }
interface Student { id: string; studentId: string; firstName: string; lastName: string; email: string; phone: string; gender: string; batch: number; departmentId: string; department: { name: string; code: string }; program: { name: string; code: string }; semester: { semesterNumber: number; academicYear: string }; section: { name: string }; profileImageUrl: string | null; status: string }

interface Props {
  initialStudents: Student[];
  departments: Department[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialDept: string; initialPage: number;
  activeCount: number; graduatedCount: number;
}

export function StudentsClient({ initialStudents, departments, totalPages, totalCount, initialSearch, initialDept, initialPage, activeCount, graduatedCount }: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [dept, setDept] = React.useState(initialDept);
  const [page] = React.useState(initialPage);
  const [deleteItem, setDeleteItem] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const navigate = (newSearch = search, newDept = dept, newPage = 1) => {
    window.location.href = `/admin/students?search=${newSearch}&dept=${newDept}&page=${newPage}`;
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteStudent(deleteItem.id); showToast("Student deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { ACTIVE: "bg-emerald-50 text-emerald-700", GRADUATED: "bg-blue-50 text-blue-700", SUSPENDED: "bg-red-50 text-red-600" };
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${map[s] || map.ACTIVE}`}>{s}</span>;
  };

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.msg}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Student Management</h1><p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} students enrolled</p></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: "Total Students", value: totalCount, color: "text-[#0058be] bg-[#0058be]/10", Icon: GraduationCap }, { label: "Active", value: activeCount, color: "text-emerald-600 bg-emerald-50", Icon: CheckCircle }, { label: "Graduated", value: graduatedCount, color: "text-blue-600 bg-blue-50", Icon: GraduationCap }].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span><div className={`rounded-md p-2 ${s.color}`}><s.Icon className="h-4 w-4" /></div></div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-on-surface-variant" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && navigate(search)} placeholder="Search students by name, ID, or email…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 shadow-sm">
          <Filter className="h-4 w-4 text-on-surface-variant" />
          <select value={dept} onChange={e => { setDept(e.target.value); navigate(search, e.target.value); }} className="bg-transparent text-sm text-on-surface outline-none">
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>{["Student ID", "Name", "Department", "Program", "Batch", "Sem / Section", "Status", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {initialStudents.length === 0 ? <tr><td colSpan={8} className="py-16 text-center text-on-surface-variant">No students found.</td></tr>
                : initialStudents.map(s => (
                  <tr key={s.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3"><span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">{s.studentId}</span></td>
                    <td className="px-4 py-3 font-medium text-on-surface">{s.firstName} {s.lastName}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{s.department.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{s.program.code}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{s.batch}</td>
                    <td className="px-4 py-3 text-on-surface-variant">Sem {s.semester.semesterNumber} · {s.section.name}</td>
                    <td className="px-4 py-3">{statusBadge(s.status)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDeleteItem(s)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => navigate(search, dept, page - 1)} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => navigate(search, dept, page + 1)} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {deleteItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            <h2 className="text-lg font-bold text-on-surface">Delete Student</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Delete <strong>{deleteItem.firstName} {deleteItem.lastName}</strong> ({deleteItem.studentId})? This cannot be undone.</p>
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
