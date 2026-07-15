"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, School, CheckCircle, XCircle, ChevronLeft, ChevronRight, MonitorSpeaker } from "lucide-react";
import { createClassroom, updateClassroom, deleteClassroom } from "./actions";

const schema = z.object({
  roomCode: z.string().min(1, "Room code required"),
  building: z.string().min(1, "Building required"),
  floor: z.coerce.number().int().min(0).max(30),
  capacity: z.coerce.number().int().min(1).max(500),
  roomType: z.enum(["CLASSROOM", "LAB"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type FormValues = z.infer<typeof schema>;

interface Classroom { id: string; campusId: string; campus: { name: string }; roomCode: string; building: string; floor: number; capacity: number; roomType: string; status: string }

interface Props {
  initialClassrooms: Classroom[];
  totalPages: number; totalCount: number;
  initialSearch: string; initialPage: number;
  classroomCount: number; labCount: number;
}

export function ClassroomsClient({ initialClassrooms, totalPages, totalCount, initialSearch, initialPage, classroomCount, labCount }: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<Classroom | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Classroom | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { roomCode: "", building: "Block A", floor: 0, capacity: 60, roomType: "CLASSROOM", status: "ACTIVE" } });

  const openEdit = (c: Classroom) => { setEditItem(c); form.reset({ roomCode: c.roomCode, building: c.building, floor: c.floor, capacity: c.capacity, roomType: c.roomType as "CLASSROOM" | "LAB", status: c.status as "ACTIVE" | "INACTIVE" }); };
  const openAdd = () => { setEditItem(null); form.reset({ roomCode: "", building: "Block A", floor: 0, capacity: 60, roomType: "CLASSROOM", status: "ACTIVE" }); setShowAdd(true); };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) { await updateClassroom(editItem.id, data); showToast("Classroom updated"); setEditItem(null); }
      else { await createClassroom(data); showToast("Classroom created"); setShowAdd(false); }
      window.location.reload();
    } catch { showToast("Failed to save", "error"); } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try { await deleteClassroom(deleteItem.id); showToast("Classroom deleted"); setDeleteItem(null); window.location.reload(); }
    catch { showToast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  const isDialogOpen = showAdd || !!editItem;

  const typeBadge = (t: string) => t === "LAB"
    ? <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700"><MonitorSpeaker className="h-3 w-3" />Lab</span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"><School className="h-3 w-3" />Classroom</span>;

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.msg}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-h2 font-bold tracking-tight text-on-surface">Classrooms</h1><p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} rooms on campus</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Room</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: "Total Rooms", value: totalCount, color: "text-[#0058be] bg-[#0058be]/10", Icon: School }, { label: "Classrooms", value: classroomCount, color: "text-blue-600 bg-blue-50", Icon: School }, { label: "Labs", value: labCount, color: "text-violet-600 bg-violet-50", Icon: MonitorSpeaker }].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span><div className={`rounded-md p-2 ${s.color}`}><s.Icon className="h-4 w-4" /></div></div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-on-surface-variant" />
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && (window.location.href = `/admin/classrooms?search=${search}&page=1`)} placeholder="Search by room code or building…" className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant" />
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>{["Room Code", "Building", "Floor", "Capacity", "Type", "Status", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {initialClassrooms.length === 0 ? <tr><td colSpan={7} className="py-16 text-center text-on-surface-variant">No classrooms found.</td></tr>
                : initialClassrooms.map(c => (
                  <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-on-surface">{c.roomCode}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.building}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.floor === 0 ? "Ground" : `Floor ${c.floor}`}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.capacity}</td>
                    <td className="px-4 py-3">{typeBadge(c.roomType)}</td>
                    <td className="px-4 py-3">{c.status === "ACTIVE" ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle className="h-3 w-3" />Active</span> : <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"><XCircle className="h-3 w-3" />Inactive</span>}</td>
                    <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button><button onClick={() => setDeleteItem(c)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => window.location.href = `/admin/classrooms?search=${search}&page=${page - 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => window.location.href = `/admin/classrooms?search=${search}&page=${page + 1}`} className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4"><h2 className="text-lg font-bold text-on-surface">{editItem ? "Edit Room" : "Add Room"}</h2></div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Room Code *</label><input {...form.register("roomCode")} placeholder="e.g. 101" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />{form.formState.errors.roomCode && <p className="mt-1 text-xs text-red-500">{form.formState.errors.roomCode.message}</p>}</div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Building *</label><input {...form.register("building")} placeholder="e.g. Block A" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Floor</label><input type="number" min={0} {...form.register("floor")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Capacity *</label><input type="number" min={1} {...form.register("capacity")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Room Type</label><select {...form.register("roomType")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"><option value="CLASSROOM">Classroom</option><option value="LAB">Lab</option></select></div>
                <div><label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Status</label><select {...form.register("status")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
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
            <h2 className="text-lg font-bold text-on-surface">Delete Room</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Delete <strong>{deleteItem.roomCode}</strong> ({deleteItem.building})? This cannot be undone.</p>
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
