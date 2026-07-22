"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AttendanceStatus } from "@prisma/client";

// Helper to get authenticated student profile
async function getStudentProfile() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { studentProfile: true },
  });

  if (!user || user.role !== "STUDENT" || !user.studentProfile) {
    throw new Error("Student profile not found");
  }

  return user.studentProfile;
}

export async function submitStudentAttendance(data: {
  teachingAssignmentId: string;
  status: AttendanceStatus;
  remarks?: string;
}) {
  try {
    const student = await getStudentProfile();

    // Verify teaching assignment exists, is active, and is assigned to student's section
    const assignment = await prisma.teachingAssignment.findUnique({
      where: { id: data.teachingAssignmentId },
    });

    if (!assignment) {
      throw new Error("Class assignment not found");
    }

    if (!assignment.isClassActive || !assignment.classStartedAt) {
      throw new Error("This class session is no longer active");
    }

    if (assignment.sectionId !== student.sectionId) {
      throw new Error("You are not registered in this class section");
    }

    const attendanceDate = assignment.classStartedAt;

    // Create or update attendance record
    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_teachingAssignmentId_attendanceDate: {
          studentId: student.id,
          teachingAssignmentId: data.teachingAssignmentId,
          attendanceDate,
        },
      },
      update: {
        status: data.status,
        remarks: data.remarks || null,
      },
      create: {
        studentId: student.id,
        teachingAssignmentId: data.teachingAssignmentId,
        attendanceDate,
        status: data.status,
        remarks: data.remarks || null,
      },
    });

    revalidatePath("/student");
    revalidatePath("/faculty");
    return { success: true, attendance };
  } catch (error) {
    console.error("Failed to submit student attendance:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit student attendance");
  }
}
