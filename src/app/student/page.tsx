import React from "react";
import { CheckSquare, Award, Clock, FileEdit } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ActiveClassPortal } from "./active-class-portal";

export default async function StudentDashboard() {
  const { userId } = await auth();

  let attendanceSummary = "88%";
  const cgpaGrade = "8.75 / 10";
  const classesToday = "3 Classes";
  let assignmentsDue = "2 Pending";
  let assignmentsInfo = "Deadline: 18th July";
  let activeClassData: {
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
  } | null = null;

  let attendanceRecordData: {
    status: "PRESENT" | "ABSENT";
    remarks: string | null;
  } | null = null;

  try {
    if (userId) {
      const userProfile = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        include: {
          studentProfile: {
            include: {
              attendance: true,
              section: {
                include: {
                  teachingAssignments: {
                    include: {
                      subject: true,
                      faculty: true,
                      assignments: {
                        where: {
                          deadline: {
                            gte: new Date(),
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const student = userProfile?.studentProfile;
      if (student) {
        // Fetch active class for student's section
        const activeTA = student.section.teachingAssignments.find(
          t => t.isClassActive
        );

        if (activeTA) {
          activeClassData = {
            id: activeTA.id,
            classStartedAt: activeTA.classStartedAt ? activeTA.classStartedAt.toISOString() : null,
            subject: {
              name: activeTA.subject.name,
              code: activeTA.subject.code,
            },
            faculty: {
              firstName: activeTA.faculty.firstName,
              lastName: activeTA.faculty.lastName,
            },
          };

          // Check if student has attendance submitted for this active class session
          const att = await prisma.attendance.findFirst({
            where: {
              studentId: student.id,
              teachingAssignmentId: activeTA.id,
              attendanceDate: activeTA.classStartedAt || undefined,
            },
          });

          if (att) {
            attendanceRecordData = {
              status: att.status,
              remarks: att.remarks,
            };
          }
        }

        // 1. Attendance Summary
        if (student.attendance.length > 0) {
          const presentCount = student.attendance.filter(a => a.status === "PRESENT").length;
          attendanceSummary = `${Math.round((presentCount / student.attendance.length) * 100)}%`;
        } else {
          attendanceSummary = "100%";
        }

        // 2. Assignments Due
        let pending = 0;
        let nextDeadline: Date | null = null;
        student.section.teachingAssignments.forEach(t => {
          t.assignments.forEach(a => {
            pending++;
            if (!nextDeadline || a.deadline < nextDeadline) {
              nextDeadline = a.deadline;
            }
          });
        });
        assignmentsDue = `${pending} Pending`;
        if (nextDeadline) {
          assignmentsInfo = `Next: ${new Date(nextDeadline).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;
        } else {
          assignmentsInfo = "No upcoming deadlines";
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch student stats from database, using fallback values:", error);
  }

  const stats = [
    {
      label: "Attendance Summary",
      value: attendanceSummary,
      icon: CheckSquare,
      info: "Minimum required: 75%",
    },
    {
      label: "CGPA Grade",
      value: cgpaGrade,
      icon: Award,
      info: "Last Term SGPA: 8.90",
    },
    {
      label: "Today's Schedule",
      value: classesToday,
      icon: Clock,
      info: "Next class: 13:00 (Room 101)",
    },
    {
      label: "Assignments Due",
      value: assignmentsDue,
      icon: FileEdit,
      info: assignmentsInfo,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-h2 font-h2 font-bold tracking-tight text-on-surface">
          Welcome back, Student
        </h1>
        <p className="text-body-sm font-body-sm text-on-surface-variant mt-1.5 font-medium">
          Here is your academic progress and schedule at a glance.
        </p>
      </div>

      {/* Active Class Attendance Portal */}
      <ActiveClassPortal
        activeClass={activeClassData}
        initialAttendance={attendanceRecordData}
      />

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                  {stat.label}
                </span>
                <div className="rounded-md bg-[#0058be]/10 p-2.5 text-[#0058be]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-h3 font-h3 font-bold tracking-tight text-on-surface">
                  {stat.value}
                </span>
                <p className="mt-1.5 text-body-sm font-body-sm text-on-surface-variant font-semibold">
                  {stat.info}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <h2 className="text-h3 font-h3 font-bold text-on-surface">
            Attendance Breakdown
          </h2>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant leading-relaxed font-medium">
            View attendance registers for theory lectures, practical labs, and check eligibility status for end term exams.
          </p>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <h2 className="text-h3 font-h3 font-bold text-on-surface">
            Assessments Hub
          </h2>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant leading-relaxed font-medium">
            Review exam marks, internal grading metrics, assignment instructions, and track SGPA/CGPA history.
          </p>
        </div>
      </div>
    </div>
  );
}
