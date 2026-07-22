"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { submitStudentAttendance } from "./actions";

interface ActiveClass {
  id: string;
  classStartedAt: string | null;
  subject: {
    name: string;
    code: string;
  };
  faculty: {
    firstName: string;
    lastName: string;
  };
}

interface ActiveClassPortalProps {
  activeClass: ActiveClass | null;
  initialAttendance: {
    status: "PRESENT" | "ABSENT";
    remarks: string | null;
  } | null;
}

export function ActiveClassPortal({ activeClass, initialAttendance }: ActiveClassPortalProps) {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [selectedStatus, setSelectedStatus] = useState<"PRESENT" | "ABSENT" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!activeClass) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    if (selectedStatus === "ABSENT" && !remarks.trim()) {
      setError("Please provide a reason for your absence.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await submitStudentAttendance({
        teachingAssignmentId: activeClass.id,
        status: selectedStatus,
        remarks: selectedStatus === "ABSENT" ? remarks : undefined,
      });
      setAttendance({
        status: selectedStatus,
        remarks: selectedStatus === "ABSENT" ? remarks : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Banner Header */}
      <div className="bg-primary/5 border-b border-outline-variant px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Class Ongoing Now</span>
            <h2 className="text-h3 font-bold text-on-surface leading-tight mt-0.5">
              {activeClass.subject.name} ({activeClass.subject.code})
            </h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-on-surface-variant font-medium">Instructor</p>
          <p className="text-sm font-semibold text-on-surface">
            Prof. {activeClass.faculty.firstName} {activeClass.faculty.lastName}
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6">
        {attendance ? (
          /* Attendance Already Marked View */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="space-y-1">
              <p className="text-sm font-bold text-on-surface">Attendance Status Recorded</p>
              <p className="text-xs text-on-surface-variant font-medium">
                Your response has been saved. The instructor will finalize the session registry shortly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {attendance.status === "PRESENT" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-sm font-semibold text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                  Self-Marked: Present
                </span>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3.5 py-1 text-sm font-semibold text-red-700">
                    <XCircle className="h-4 w-4" />
                    Self-Marked: Absent
                  </span>
                  {attendance.remarks && (
                    <span className="text-xs text-on-surface-variant/80 mt-1 italic max-w-xs text-right">
                      Reason: &quot;{attendance.remarks}&quot;
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Attendance Marking Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">
                Are you attending this lecture today?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus("PRESENT");
                    setError(null);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:bg-emerald-50/20 ${
                    selectedStatus === "PRESENT"
                      ? "border-emerald-500 bg-emerald-50/10 text-emerald-700 shadow-sm"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  <CheckCircle className={`h-6 w-6 mb-1 ${selectedStatus === "PRESENT" ? "text-emerald-500" : ""}`} />
                  <span className="text-sm font-semibold">Yes, I am Present</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus("ABSENT");
                    setError(null);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:bg-red-50/20 ${
                    selectedStatus === "ABSENT"
                      ? "border-red-500 bg-red-50/10 text-red-700 shadow-sm"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  <XCircle className={`h-6 w-6 mb-1 ${selectedStatus === "ABSENT" ? "text-red-500" : ""}`} />
                  <span className="text-sm font-semibold">No, I am Absent</span>
                </button>
              </div>
            </div>

            {/* If Absent, Require Reason */}
            {selectedStatus === "ABSENT" && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <label htmlFor="reason" className="text-xs font-bold text-on-surface-variant">
                  Reason for Absence <span className="text-error">*</span>
                </label>
                <textarea
                  id="reason"
                  rows={2}
                  required
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. Under the weather, family medical emergency, stuck in transit..."
                  className="w-full bg-surface-container border border-outline-variant rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/40"
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-error bg-error-container p-3 rounded-lg text-xs font-semibold">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!selectedStatus || isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Attendance Status"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
