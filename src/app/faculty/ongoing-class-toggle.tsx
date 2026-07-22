"use client";

import React, { useState } from "react";
import { Play, Square, Check, X, Loader2, Users, AlertCircle } from "lucide-react";
import { toggleOngoingClass, getSessionAttendance, submitFinalAttendance } from "./actions";

interface TeachingAssignment {
  id: string;
  isClassActive: boolean;
  classStartedAt: Date | null;
  subject: {
    name: string;
    code: string;
  };
  semester: {
    semesterNumber: number;
    academicYear: string;
    program: {
      name: string;
    };
  };
  section: {
    name: string;
  };
}

interface StudentAttendanceRecord {
  studentId: string;
  firstName: string;
  lastName: string;
  rollNo: string;
  status: "PRESENT" | "ABSENT";
  remarks: string | null;
  isSelfMarked: boolean;
}

interface OngoingClassToggleProps {
  initialAssignments: TeachingAssignment[];
}

export function OngoingClassToggle({ initialAssignments }: OngoingClassToggleProps) {
  const [assignments, setAssignments] = useState<TeachingAssignment[]>(initialAssignments);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [reviewingAssignment, setReviewingAssignment] = useState<TeachingAssignment | null>(null);
  const [studentRecords, setStudentRecords] = useState<StudentAttendanceRecord[]>([]);
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const activeAssignment = assignments.find(a => a.isClassActive);

  const handleStartClass = async (assignmentId: string) => {
    setLoadingId(assignmentId);
    try {
      const updated = await toggleOngoingClass(assignmentId, true);
      setAssignments(prev =>
        prev.map(a =>
          a.id === assignmentId
            ? { ...a, isClassActive: true, classStartedAt: updated.classStartedAt }
            : a
        )
      );
    } catch {
      alert("Failed to start class. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleOpenReviewModal = async (assignment: TeachingAssignment) => {
    setLoadingId(assignment.id);
    setFetchError(null);
    try {
      const records = await getSessionAttendance(assignment.id);
      setStudentRecords(records);
      setReviewingAssignment(assignment);
    } catch {
      setFetchError("Failed to fetch current attendance records.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleStudentStatus = (studentId: string) => {
    setStudentRecords(prev =>
      prev.map(r => {
        if (r.studentId === studentId) {
          const newStatus = r.status === "PRESENT" ? "ABSENT" : "PRESENT";
          return {
            ...r,
            status: newStatus,
            remarks: newStatus === "PRESENT" ? null : "Marked absent by teacher",
          };
        }
        return r;
      })
    );
  };

  const handleStudentRemarkChange = (studentId: string, remarks: string) => {
    setStudentRecords(prev =>
      prev.map(r => (r.studentId === studentId ? { ...r, remarks } : r))
    );
  };
  const handleSubmitAttendance = async () => {
    if (!reviewingAssignment) return;
    setIsSubmittingAttendance(true);
    try {
      await submitFinalAttendance(
        reviewingAssignment.id,
        studentRecords.map(r => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks || undefined,
        }))
      );
      // Update local state to set class inactive
      setAssignments(prev =>
        prev.map(a =>
          a.id === reviewingAssignment.id
            ? { ...a, isClassActive: false, classStartedAt: null }
            : a
        )
      );
      setReviewingAssignment(null);
    } catch {
      alert("Failed to submit final attendance. Please try again.");
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Session Card Banner */}
      {activeAssignment && (
        <div className="rounded-xl bg-primary-container p-6 text-on-primary-container shadow-sm border border-primary/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Class is Live
            </span>
            <h2 className="text-h3 font-bold text-on-surface">
              {activeAssignment.subject.name}
            </h2>
            <p className="text-body-sm text-on-surface-variant font-medium">
              {activeAssignment.semester.program.name} · Semester {activeAssignment.semester.semesterNumber} · {activeAssignment.section.name}
            </p>
            {activeAssignment.classStartedAt && (
              <p className="text-xs text-on-surface-variant/85 italic">
                Started at {new Date(activeAssignment.classStartedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div>
            <button
              onClick={() => handleOpenReviewModal(activeAssignment)}
              disabled={loadingId === activeAssignment.id}
              className="inline-flex items-center gap-2 rounded-lg bg-error px-4 py-2.5 text-sm font-semibold text-on-error hover:bg-error/95 transition-colors shadow-sm disabled:opacity-50"
            >
              {loadingId === activeAssignment.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Square className="h-4 w-4 fill-current" />
              )}
              End Class & Submit Attendance
            </button>
          </div>
        </div>
      )}

      {/* Class List Card Grid */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="border-b border-outline-variant px-6 py-4 flex items-center gap-2.5">
          <Users className="h-5 w-5 text-on-surface-variant" />
          <h2 className="text-h3 font-bold text-on-surface">Your Class Sessions</h2>
        </div>
        {assignments.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            No teaching assignments mapped to your profile. Please contact Admin.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {assignments.map((assignment) => {
              const isCurrentActive = assignment.isClassActive;
              const isBlocked = activeAssignment && !isCurrentActive;

              return (
                <div
                  key={assignment.id}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 gap-4 transition-colors ${
                    isCurrentActive ? "bg-surface-container-low" : ""
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-primary">{assignment.subject.code}</span>
                      <h3 className="font-bold text-on-surface text-base">{assignment.subject.name}</h3>
                    </div>
                    <p className="text-body-sm text-on-surface-variant font-medium">
                      {assignment.semester.program.name} · Sem {assignment.semester.semesterNumber} · {assignment.section.name}
                    </p>
                  </div>
                  <div>
                    {isCurrentActive ? (
                      <button
                        onClick={() => handleOpenReviewModal(assignment)}
                        disabled={loadingId === assignment.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-error px-4 py-2 text-sm font-semibold text-on-error hover:bg-error/95 transition-colors disabled:opacity-50"
                      >
                        {loadingId === assignment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Square className="h-4 w-4 fill-current" />
                        )}
                        End Session
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartClass(assignment.id)}
                        disabled={isBlocked || loadingId === assignment.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/95 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {loadingId === assignment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 fill-current" />
                        )}
                        Start Session
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review & Manual Override Attendance Modal */}
      {reviewingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="border-b border-outline-variant px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-h3 font-bold text-on-surface">
                  Review & Override Attendance
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {reviewingAssignment.subject.name} ({reviewingAssignment.section.name})
                </p>
              </div>
              <button
                onClick={() => setReviewingAssignment(null)}
                className="text-on-surface-variant hover:text-on-surface rounded-lg p-1.5 hover:bg-surface-container-low transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {fetchError ? (
                <div className="flex items-center gap-2 text-error bg-error-container p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{fetchError}</span>
                </div>
              ) : studentRecords.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant">
                  No students registered in this section.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-outline-variant">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface text-sm font-bold border-b border-outline-variant">
                        <th className="px-6 py-3.5">Roll No</th>
                        <th className="px-6 py-3.5">Student Name</th>
                        <th className="px-6 py-3.5">Self-Marked Status</th>
                        <th className="px-6 py-3.5">Attendance Remarks / Reason</th>
                        <th className="px-6 py-3.5 text-center">Teacher Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-sm">
                      {studentRecords.map((record) => {
                        const isPresent = record.status === "PRESENT";
                        return (
                          <tr key={record.studentId} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-6 py-3.5 font-semibold text-on-surface">{record.rollNo}</td>
                            <td className="px-6 py-3.5 font-medium text-on-surface">
                              {record.firstName} {record.lastName}
                            </td>
                            <td className="px-6 py-3.5">
                              {record.isSelfMarked ? (
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    record.status === "PRESENT"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-700"
                                  }`}
                                >
                                  {record.status === "PRESENT" ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <X className="h-3 w-3" />
                                  )}
                                  {record.status}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 text-xs font-semibold">
                                  Not Marked (Absent)
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-3.5">
                              {isPresent ? (
                                <span className="text-xs text-on-surface-variant/70 italic">-</span>
                              ) : (
                                <input
                                  type="text"
                                  value={record.remarks || ""}
                                  onChange={(e) =>
                                    handleStudentRemarkChange(record.studentId, e.target.value)
                                  }
                                  placeholder="Provide reason for absence"
                                  className="w-full bg-surface-container px-3 py-1.5 rounded border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/50"
                                />
                              )}
                            </td>
                            <td className="px-6 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleStudentStatus(record.studentId)}
                                className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  isPresent
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                }`}
                              >
                                {isPresent ? "Mark Absent" : "Mark Present"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-outline-variant px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setReviewingAssignment(null)}
                disabled={isSubmittingAttendance}
                className="rounded-lg border border-outline px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAttendance}
                disabled={isSubmittingAttendance || studentRecords.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmittingAttendance && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Final Attendance & End Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
