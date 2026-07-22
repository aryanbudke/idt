"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getTeachingAssignments(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { faculty: { firstName: { contains: search, mode: "insensitive" as const } } },
            { faculty: { lastName: { contains: search, mode: "insensitive" as const } } },
            { subject: { name: { contains: search, mode: "insensitive" as const } } },
            { subject: { code: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {};

    const [assignments, totalCount] = await Promise.all([
      prisma.teachingAssignment.findMany({
        where,
        include: {
          faculty: true,
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
        skip,
        take: limit,
      }),
      prisma.teachingAssignment.count({ where }),
    ]);

    return { assignments, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch (error) {
    console.error("Failed to fetch teaching assignments:", error);
    return { assignments: [], totalPages: 1, totalCount: 0 };
  }
}

export async function createTeachingAssignment(data: {
  facultyId: string;
  subjectId: string;
  semesterId: string;
  sectionId: string;
  academicYear: string;
}) {
  try {
    const ta = await prisma.teachingAssignment.create({
      data,
    });
    revalidatePath("/admin/teaching-assignments");
    return ta;
  } catch (error) {
    console.error("Failed to create teaching assignment:", error);
    throw new Error("Failed to create teaching assignment");
  }
}

export async function updateTeachingAssignment(
  id: string,
  data: {
    facultyId: string;
    subjectId: string;
    semesterId: string;
    sectionId: string;
    academicYear: string;
  }
) {
  try {
    const ta = await prisma.teachingAssignment.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/teaching-assignments");
    return ta;
  } catch (error) {
    console.error("Failed to update teaching assignment:", error);
    throw new Error("Failed to update teaching assignment");
  }
}

export async function deleteTeachingAssignment(id: string) {
  try {
    const ta = await prisma.teachingAssignment.delete({
      where: { id },
    });
    revalidatePath("/admin/teaching-assignments");
    return ta;
  } catch (error) {
    console.error("Failed to delete teaching assignment:", error);
    throw new Error("Failed to delete teaching assignment");
  }
}

export async function getFacultyList() {
  try {
    return await prisma.faculty.findMany({
      where: { status: "ACTIVE" },
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        facultyId: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch faculty list:", error);
    return [];
  }
}

export async function getSubjectList() {
  try {
    return await prisma.subject.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch subject list:", error);
    return [];
  }
}

export async function getSemesterList() {
  try {
    return await prisma.semester.findMany({
      where: { status: "ACTIVE" },
      include: {
        program: true,
      },
      orderBy: [
        { academicYear: "desc" },
        { semesterNumber: "asc" },
      ],
    });
  } catch (error) {
    console.error("Failed to fetch semester list:", error);
    return [];
  }
}

export async function getSectionList() {
  try {
    return await prisma.section.findMany({
      include: {
        semester: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch section list:", error);
    return [];
  }
}
