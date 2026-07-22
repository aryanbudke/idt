"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AttendanceStatus } from "@prisma/client";

// Helper to get authenticated faculty profile
async function getFacultyProfile() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { facultyProfile: true },
  });

  if (!user || user.role !== "FACULTY" || !user.facultyProfile) {
    throw new Error("Faculty profile not found");
  }

  return user.facultyProfile;
}

export async function getFacultyTeachingAssignments() {
  try {
    const faculty = await getFacultyProfile();
    return await prisma.teachingAssignment.findMany({
      where: { facultyId: faculty.id },
      include: {
        subject: true,
        semester: {
          include: {
            program: true,
          },
        },
        section: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch faculty teaching assignments:", error);
    return [];
  }
}

export async function toggleOngoingClass(assignmentId: string, start: boolean) {
  try {
    const faculty = await getFacultyProfile();

    // Verify assignment belongs to this faculty
    const assignment = await prisma.teachingAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment || assignment.facultyId !== faculty.id) {
      throw new Error("Unauthorized to toggle this assignment");
    }

    const updated = await prisma.teachingAssignment.update({
      where: { id: assignmentId },
      data: {
        isClassActive: start,
        classStartedAt: start ? new Date() : null,
      },
    });

    revalidatePath("/faculty");
    revalidatePath("/student");
    return updated;
  } catch (error) {
    console.error("Failed to toggle ongoing class:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to toggle ongoing class");
  }
}

export async function getSessionAttendance(assignmentId: string) {
  try {
    const faculty = await getFacultyProfile();

    const assignment = await prisma.teachingAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        section: {
          include: {
            students: {
              orderBy: {
                firstName: "asc",
              },
            },
          },
        },
      },
    });

    if (!assignment || assignment.facultyId !== faculty.id) {
      throw new Error("Unauthorized to access session attendance");
    }

    if (!assignment.classStartedAt) {
      return [];
    }

    // Get attendance records submitted for this assignment since it started
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        teachingAssignmentId: assignmentId,
        attendanceDate: {
          gte: assignment.classStartedAt,
        },
      },
    });

    const recordMap = new Map(attendanceRecords.map(r => [r.studentId, r]));

    // Map all section students to current status
    return assignment.section.students.map(student => {
      const record = recordMap.get(student.id);
      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        rollNo: student.studentId,
        status: record ? record.status : ("ABSENT" as AttendanceStatus), // default to ABSENT if not marked yet
        remarks: record ? record.remarks : "Did not mark attendance",    // default reason
        isSelfMarked: !!record,
      };
    });
  } catch (error) {
    console.error("Failed to fetch session attendance:", error);
    return [];
  }
}

export async function submitFinalAttendance(
  assignmentId: string,
  records: Array<{ studentId: string; status: AttendanceStatus; remarks?: string }>
) {
  try {
    const faculty = await getFacultyProfile();

    const assignment = await prisma.teachingAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment || assignment.facultyId !== faculty.id) {
      throw new Error("Unauthorized to submit attendance");
    }

    const attendanceDate = assignment.classStartedAt || new Date();

    // Use transaction to upsert all attendance records and close the class
    await prisma.$transaction(async (tx) => {
      // 1. Create or update attendance for all students
      for (const record of records) {
        await tx.attendance.upsert({
          where: {
            studentId_teachingAssignmentId_attendanceDate: {
              studentId: record.studentId,
              teachingAssignmentId: assignmentId,
              attendanceDate,
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks || null,
          },
          create: {
            studentId: record.studentId,
            teachingAssignmentId: assignmentId,
            attendanceDate,
            status: record.status,
            remarks: record.remarks || null,
          },
        });
      }

      // 2. Set class as inactive
      await tx.teachingAssignment.update({
        where: { id: assignmentId },
        data: {
          isClassActive: false,
          classStartedAt: null,
        },
      });
    });

    revalidatePath("/faculty");
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit final attendance:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit final attendance");
  }
}
