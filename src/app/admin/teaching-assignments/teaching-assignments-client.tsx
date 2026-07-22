"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, Briefcase, ChevronLeft, ChevronRight, User, BookOpen } from "lucide-react";
import { createTeachingAssignment, updateTeachingAssignment, deleteTeachingAssignment } from "./actions";

const schema = z.object({
  facultyId: z.string().min(1, "Faculty required"),
  subjectId: z.string().min(1, "Subject required"),
  semesterId: z.string().min(1, "Semester required"),
  sectionId: z.string().min(1, "Section required"),
  academicYear: z.string().min(1, "Academic year required").regex(/^\d{4}-\d{2}$/, "Format must be YYYY-YY (e.g. 2024-25)"),
});
type FormValues = z.infer<typeof schema>;

interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  facultyId: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Semester {
  id: string;
  semesterNumber: number;
  academicYear: string;
  program: {
    name: string;
    code: string;
  };
}

interface Section {
  id: string;
  name: string;
  semesterId: string;
}

interface TeachingAssignment {
  id: string;
  facultyId: string;
  faculty: Faculty;
  subjectId: string;
  subject: Subject;
  semesterId: string;
  semester: Semester;
  sectionId: string;
  section: Section;
  academicYear: string;
}

interface Props {
  initialAssignments: TeachingAssignment[];
  faculties: Faculty[];
  subjects: Subject[];
  semesters: Semester[];
  sections: Section[];
  totalPages: number;
  totalCount: number;
  initialSearch: string;
  initialPage: number;
}

export function TeachingAssignmentsClient({
  initialAssignments,
  faculties,
  subjects,
  semesters,
  sections,
  totalPages,
  totalCount,
  initialSearch,
  initialPage,
}: Props) {
  const [search, setSearch] = React.useState(initialSearch);
  const [page] = React.useState(initialPage);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<TeachingAssignment | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<TeachingAssignment | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      facultyId: "",
      subjectId: "",
      semesterId: "",
      sectionId: "",
      academicYear: "2024-25",
    },
  });

  const selectedSemesterId = useWatch({
    control: form.control,
    name: "semesterId",
  });

  // Filter sections that belong to the selected semester
  const filteredSections = sections.filter(sec => sec.semesterId === selectedSemesterId);

  const openEdit = (ta: TeachingAssignment) => {
    setEditItem(ta);
    form.reset({
      facultyId: ta.facultyId,
      subjectId: ta.subjectId,
      semesterId: ta.semesterId,
      sectionId: ta.sectionId,
      academicYear: ta.academicYear,
    });
  };

  const openAdd = () => {
    setEditItem(null);
    form.reset({
      facultyId: faculties[0]?.id || "",
      subjectId: subjects[0]?.id || "",
      semesterId: semesters[0]?.id || "",
      sectionId: "",
      academicYear: "2024-25",
    });
    setShowAdd(true);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editItem) {
        await updateTeachingAssignment(editItem.id, data);
        showToast("Assignment updated successfully");
        setEditItem(null);
      } else {
        await createTeachingAssignment(data);
        showToast("Assignment created successfully");
        setShowAdd(false);
      }
      window.location.reload();
    } catch {
      showToast("Failed to save assignment", "error");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try {
      await deleteTeachingAssignment(deleteItem.id);
      showToast("Assignment deleted successfully");
      setDeleteItem(null);
      window.location.reload();
    } catch {
      showToast("Failed to delete assignment", "error");
    } finally {
      setLoading(false);
    }
  };

  const uniqueFacultiesCount = new Set(initialAssignments.map(a => a.facultyId)).size;
  const uniqueSubjectsCount = new Set(initialAssignments.map(a => a.subjectId)).size;

  const isDialogOpen = showAdd || !!editItem;

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-tight text-on-surface">Teaching Assignments</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">{totalCount} total teaching roles assigned</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Assign Faculty
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Assignments", value: totalCount, color: "text-[#0058be] bg-[#0058be]/10", Icon: Briefcase },
          { label: "Assigned Faculty", value: uniqueFacultiesCount, color: "text-blue-600 bg-blue-50", Icon: User },
          { label: "Unique Subjects", value: uniqueSubjectsCount, color: "text-violet-600 bg-violet-50", Icon: BookOpen },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span>
              <div className={`rounded-md p-2 ${s.color}`}><s.Icon className="h-4 w-4" /></div>
            </div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-on-surface-variant" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (window.location.href = `/admin/teaching-assignments?search=${search}&page=1`)}
          placeholder="Search by faculty name or subject code…"
          className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                {["Faculty Member", "Subject", "Semester", "Section", "Academic Year", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {initialAssignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                    No teaching assignments found.
                  </td>
                </tr>
              ) : (
                initialAssignments.map(ta => (
                  <tr key={ta.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-on-surface">{`${ta.faculty.firstName} ${ta.faculty.lastName}`}</div>
                      <div className="text-xs text-on-surface-variant">{ta.faculty.facultyId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-on-surface">{ta.subject.name}</div>
                      <div className="text-xs text-on-surface-variant">{ta.subject.code}</div>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {`${ta.semester.program.code} - Sem ${ta.semester.semesterNumber}`}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{ta.section.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{ta.academicYear}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(ta)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteItem(ta)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => (window.location.href = `/admin/teaching-assignments?search=${search}&page=${page - 1}`)}
              className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => (window.location.href = `/admin/teaching-assignments?search=${search}&page=${page + 1}`)}
              className="rounded-md border border-outline-variant p-1.5 disabled:opacity-40 hover:bg-surface-container transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialog for Add/Edit */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
            <div className="border-b border-outline-variant px-6 py-4">
              <h2 className="text-lg font-bold text-on-surface">
                {editItem ? "Edit Teaching Assignment" : "Assign Faculty"}
              </h2>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              {/* Faculty selection */}
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Faculty Member *</label>
                <select {...form.register("facultyId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>
                      {`${f.firstName} ${f.lastName} (${f.facultyId})`}
                    </option>
                  ))}
                </select>
                {form.formState.errors.facultyId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.facultyId.message}</p>}
              </div>

              {/* Subject selection */}
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Subject *</label>
                <select {...form.register("subjectId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {`${s.code} - ${s.name}`}
                    </option>
                  ))}
                </select>
                {form.formState.errors.subjectId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.subjectId.message}</p>}
              </div>

              {/* Semester selection */}
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Semester *</label>
                <select {...form.register("semesterId")} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="" disabled>Select Semester</option>
                  {semesters.map(sem => (
                    <option key={sem.id} value={sem.id}>
                      {`${sem.program.code} - Sem ${sem.semesterNumber} (${sem.academicYear})`}
                    </option>
                  ))}
                </select>
                {form.formState.errors.semesterId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.semesterId.message}</p>}
              </div>

              {/* Section selection */}
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Section *</label>
                <select
                  disabled={!selectedSemesterId}
                  {...form.register("sectionId")}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
                >
                  <option value="" disabled>Select Section</option>
                  {filteredSections.map(sec => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.sectionId && <p className="mt-1 text-xs text-red-500">{form.formState.errors.sectionId.message}</p>}
              </div>

              {/* Academic Year input */}
              <div>
                <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">Academic Year *</label>
                <input {...form.register("academicYear")} placeholder="e.g. 2024-25" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                {form.formState.errors.academicYear && <p className="mt-1 text-xs text-red-500">{form.formState.errors.academicYear.message}</p>}
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-60">
                  {loading ? "Saving…" : editItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            <h2 className="text-lg font-bold text-on-surface">Remove Assignment</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Are you sure you want to remove the teaching assignment of <strong>{`${deleteItem.faculty.firstName} ${deleteItem.faculty.lastName}`}</strong> for <strong>{deleteItem.subject.name}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteItem(null)} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container">Cancel</button>
              <button onClick={onDelete} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
