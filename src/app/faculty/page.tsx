import React from "react";
import { GraduationCap, BookOpen, CheckSquare, Award } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { OngoingClassToggle } from "./ongoing-class-toggle";

export default async function FacultyDashboard() {
  const { userId } = await auth();

  let subjectCount = 4;
  let studentCount = 240;
  let pendingAttendance = 2;
  let upcomingExams = 3;
  let teachingAssignments: Array<{
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
  }> = [];

  try {
    if (userId) {
      const userProfile = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        include: {
          facultyProfile: {
            include: {
              teachingAssignments: {
                include: {
                  subject: true,
                  semester: {
                    include: {
                      program: true,
                    },
                  },
                  section: {
                    include: {
                      students: true,
                    },
                  },
                  exams: {
                    where: {
                      examDate: {
                        gte: new Date(),
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const faculty = userProfile?.facultyProfile;
      if (faculty) {
        teachingAssignments = faculty.teachingAssignments;

        // 1. Assigned Subjects count
        const uniqueSubjects = new Set(faculty.teachingAssignments.map(t => t.subjectId));
        subjectCount = uniqueSubjects.size;

        // 2. Unique Students across all assigned sections
        const uniqueStudents = new Set();
        faculty.teachingAssignments.forEach(t => {
          t.section.students.forEach(s => {
            uniqueStudents.add(s.id);
          });
        });
        studentCount = uniqueStudents.size;

        // 3. Upcoming Exams
        upcomingExams = faculty.teachingAssignments.reduce((acc, t) => acc + t.exams.length, 0);

        // 4. Pending Attendance (mock logic based on teaching assignments)
        pendingAttendance = faculty.teachingAssignments.length > 0 ? 1 : 0;
      }
    }
  } catch (error) {
    console.error("Failed to fetch faculty stats from database, using fallback values:", error);
  }

  const stats = [
    { label: "Assigned Subjects", value: subjectCount.toString(), icon: BookOpen, change: "This semester" },
    { label: "Total Students", value: studentCount.toString(), icon: GraduationCap, change: "Across assigned sections" },
    { label: "Pending Attendance", value: pendingAttendance.toString(), icon: CheckSquare, change: "Sessions to mark" },
    { label: "Upcoming Exams", value: upcomingExams.toString(), icon: Award, change: "This month" },
  ];

  const recentSessions = [
    { subject: "Introduction to Programming", section: "Section A", date: "Today, 10:00 AM", students: 58, status: "Completed" },
    { subject: "Data Structures", section: "Section B", date: "Today, 12:00 PM", students: 55, status: "Pending" },
    { subject: "Algorithms", section: "Section A", date: "Yesterday, 2:00 PM", students: 60, status: "Completed" },
  ];

  const assignments = [
    { title: "Assignment 1: Sorting Algorithms", subject: "Data Structures", deadline: "Oct 20, 2024", submissions: 42, total: 55 },
    { title: "Lab Report 3: Binary Trees", subject: "Data Structures", deadline: "Oct 25, 2024", submissions: 30, total: 55 },
    { title: "Project Proposal", subject: "Algorithms", deadline: "Nov 01, 2024", submissions: 58, total: 60 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold tracking-tight text-on-surface">Faculty Dashboard</h1>
        <p className="mt-1 text-body-sm text-on-surface-variant font-medium">Welcome back! Here is your teaching overview for this semester.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span>
                <div className="rounded-md bg-[#0058be]/10 p-2.5 text-[#0058be]"><Icon className="h-5 w-5" /></div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-on-surface">{s.value}</span>
                <p className="mt-1.5 text-body-sm text-on-surface-variant font-medium">{s.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ongoing Class Session Control */}
      <OngoingClassToggle initialAssignments={teachingAssignments} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sessions */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="border-b border-outline-variant px-6 py-4"><h2 className="font-bold text-on-surface">Recent Sessions</h2></div>
          <div className="divide-y divide-outline-variant">
            {recentSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-sm text-on-surface">{s.subject}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{s.section} · {s.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-on-surface-variant">{s.students} students</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Tracker */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="border-b border-outline-variant px-6 py-4"><h2 className="font-bold text-on-surface">Assignment Tracker</h2></div>
          <div className="divide-y divide-outline-variant">
            {assignments.map((a, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="font-medium text-sm text-on-surface">{a.title}</p><p className="text-xs text-on-surface-variant mt-0.5">{a.subject} · Due {a.deadline}</p></div>
                  <span className="text-xs text-on-surface-variant shrink-0 ml-2">{a.submissions}/{a.total}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
