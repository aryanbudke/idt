"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Building2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./actions";

// Validation schema using Zod
const departmentFormSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must be under 10 characters"),
  hodFacultyId: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface FacultyChoice {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
}

interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  hodFacultyId: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  hod: FacultyChoice | null;
}

interface DepartmentClientProps {
  initialDepartments: DepartmentRecord[];
  faculties: FacultyChoice[];
  totalPages: number;
  totalCount: number;
  initialSearch: string;
  initialPage: number;
}

export function DepartmentClient({
  initialDepartments,
  faculties,
  totalPages,
  totalCount,
  initialSearch,
  initialPage,
}: DepartmentClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedDept, setSelectedDept] = useState<DepartmentRecord | null>(null);

  // Forms setup
  const addForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      code: "",
      hodFacultyId: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const editForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
  });

  // Handle pagination/search transitions
  const updateUrl = (newSearch: string, newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(search, 1);
  };

  const handleReset = () => {
    setSearch("");
    updateUrl("", 1);
  };

  // Actions handlers
  const handleAddSubmit = async (values: DepartmentFormValues) => {
    startTransition(async () => {
      try {
        await createDepartment({
          name: values.name,
          code: values.code,
          hodFacultyId: values.hodFacultyId || undefined,
          description: values.description || undefined,
          status: values.status,
        });
        setIsAddOpen(false);
        addForm.reset();
      } catch (err) {
        console.error("Failed to create department:", err);
      }
    });
  };

  const handleEditSubmit = async (values: DepartmentFormValues) => {
    if (!selectedDept) return;
    startTransition(async () => {
      try {
        await updateDepartment(selectedDept.id, {
          name: values.name,
          code: values.code,
          hodFacultyId: values.hodFacultyId || undefined,
          description: values.description || undefined,
          status: values.status,
        });
        setIsEditOpen(false);
        setSelectedDept(null);
      } catch (err) {
        console.error("Failed to update department:", err);
      }
    });
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDept) return;
    startTransition(async () => {
      try {
        await deleteDepartment(selectedDept.id);
        setIsDeleteOpen(false);
        setSelectedDept(null);
      } catch (err) {
        console.error("Failed to delete department:", err);
      }
    });
  };

  const openEdit = (dept: DepartmentRecord) => {
    setSelectedDept(dept);
    editForm.reset({
      name: dept.name,
      code: dept.code,
      hodFacultyId: dept.hodFacultyId || "",
      description: dept.description || "",
      status: dept.status,
    });
    setIsEditOpen(true);
  };

  const openDelete = (dept: DepartmentRecord) => {
    setSelectedDept(dept);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-h2 font-bold tracking-tight text-on-surface">
            Department Management
          </h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1.5 font-medium">
            Oversee academic departments, codes, descriptions, and assign HODs.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-label-md shadow-md hover:opacity-90 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Department</span>
        </Button>
      </div>

      {/* Bento Grid Summary Card Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow">
          <Building2 className="text-primary h-8 w-8 mb-4" />
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Total Departments</p>
            <h4 className="text-h3 font-h3 font-bold text-on-surface mt-1">{totalCount}</h4>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow">
          <CheckCircle2 className="text-emerald-600 h-8 w-8 mb-4" />
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Active Departments</p>
            <h4 className="text-body-sm font-bold text-on-surface mt-1">
              {initialDepartments.filter(d => d.status === "ACTIVE").map(d => d.name).join(", ") || "None"}
            </h4>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow">
          <AlertCircle className="text-error h-8 w-8 mb-4" />
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Inactive Departments</p>
            <h4 className="text-body-sm font-bold text-on-surface mt-1">
              {initialDepartments.filter(d => d.status === "INACTIVE").map(d => d.name).join(", ") || "None"}
            </h4>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col lg:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            <Search className="h-4 w-4" />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all bg-surface-container-lowest text-on-surface"
            placeholder="Search by name or code (e.g., MATH)"
            type="text"
          />
        </form>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleReset}
            className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-lg font-bold text-label-md hover:bg-surface-variant transition-all cursor-pointer"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  HOD Faculty
                </th>
                <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {initialDepartments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-body-sm text-on-surface-variant font-medium">
                    No departments found. Add a department to get started.
                  </td>
                </tr>
              ) : (
                initialDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4 text-body-sm font-bold text-primary">
                      #{dept.code}
                    </td>
                    <td className="px-6 py-4 text-label-md font-bold text-on-surface">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-on-surface">
                      {dept.hod ? (
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            Dr. {dept.hod.firstName} {dept.hod.lastName}
                          </span>
                          <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                            {dept.hod.designation}
                          </span>
                        </div>
                      ) : (
                        <span className="text-outline italic text-xs font-semibold">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant max-w-xs truncate">
                      {dept.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          dept.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "bg-error-container text-on-error-container font-bold"
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(dept)}
                          className="h-8 w-8 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDelete(dept)}
                          className="h-8 w-8 rounded-md text-error hover:bg-error-container hover:text-on-error-container"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-6 py-4">
          <span className="text-label-sm font-semibold text-on-surface-variant">
            Showing {totalCount > 0 ? (initialPage - 1) * 5 + 1 : 0} to{" "}
            {Math.min(initialPage * 5, totalCount)} of {totalCount} departments
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={initialPage <= 1}
              onClick={() => updateUrl(search, initialPage - 1)}
              className="flex items-center gap-1 py-1.5 px-3 border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Button>
            <Button
              variant="outline"
              disabled={initialPage >= totalPages}
              onClick={() => updateUrl(search, initialPage + 1)}
              className="flex items-center gap-1 py-1.5 px-3 border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant disabled:opacity-50"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
            <DialogDescription>
              Create a new department in the system. Required fields are marked.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-label-sm font-bold text-on-surface-variant">
                Department Name *
              </label>
              <input
                {...addForm.register("name")}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary"
                placeholder="e.g. Computer Science & Engineering"
              />
              {addForm.formState.errors.name && (
                <p className="text-xs text-error font-semibold">
                  {addForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-label-sm font-bold text-on-surface-variant">
                  Code *
                </label>
                <input
                  {...addForm.register("code")}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary uppercase"
                  placeholder="e.g. CSE"
                />
                {addForm.formState.errors.code && (
                  <p className="text-xs text-error font-semibold">
                    {addForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-label-sm font-bold text-on-surface-variant">
                  Status
                </label>
                <select
                  {...addForm.register("status")}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-label-sm font-bold text-on-surface-variant">
                Head of Department (HOD)
              </label>
              <select
                {...addForm.register("hodFacultyId")}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary"
              >
                <option value="">Select HOD Faculty Member</option>
                {faculties.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    Dr. {fac.firstName} {fac.lastName} ({fac.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-label-sm font-bold text-on-surface-variant">
                Description
              </label>
              <textarea
                {...addForm.register("description")}
                rows={3}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary resize-none"
                placeholder="Brief department scope..."
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-primary text-on-primary font-bold hover:bg-[#004395] flex items-center justify-center gap-1.5"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Save</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department profile data in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-label-sm font-bold text-on-surface-variant">
                Department Name *
              </label>
              <input
                {...editForm.register("name")}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary"
                placeholder="e.g. Computer Science & Engineering"
              />
              {editForm.formState.errors.name && (
                <p className="text-xs text-error font-semibold">
                  {editForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-label-sm font-bold text-on-surface-variant">
                  Code *
                </label>
                <input
                  {...editForm.register("code")}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary uppercase"
                  placeholder="e.g. CSE"
                />
                {editForm.formState.errors.code && (
                  <p className="text-xs text-error font-semibold">
                    {editForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-label-sm font-bold text-on-surface-variant">
                  Status
                </label>
                <select
                  {...editForm.register("status")}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-label-sm font-bold text-on-surface-variant">
                Head of Department (HOD)
              </label>
              <select
                {...editForm.register("hodFacultyId")}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary"
              >
                <option value="">Select HOD Faculty Member</option>
                {faculties.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    Dr. {fac.firstName} {fac.lastName} ({fac.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-label-sm font-bold text-on-surface-variant">
                Description
              </label>
              <textarea
                {...editForm.register("description")}
                rows={3}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 text-body-sm text-on-surface focus:outline-hidden focus:border-primary resize-none"
                placeholder="Brief department scope..."
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-primary text-on-primary font-bold hover:bg-[#004395] flex items-center justify-center gap-1.5"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Save Changes</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-error">Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the department{" "}
              <strong className="text-on-surface">
                {selectedDept?.name} ({selectedDept?.code})
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteSubmit}
              disabled={isPending}
              className="px-6 py-2 bg-error text-on-error font-bold hover:opacity-90 flex items-center justify-center gap-1.5"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Delete Department</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
