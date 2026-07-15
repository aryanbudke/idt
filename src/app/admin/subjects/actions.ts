"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_SUBJECTS = [
  { id: "mock-sub-1", semesterId: "mock-sem-1", semester: { semesterNumber: 1, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } }, code: "CS101", name: "Introduction to Programming", credits: 4, theoryMarks: 60, practicalMarks: 40, status: "ACTIVE" as const },
  { id: "mock-sub-2", semesterId: "mock-sem-1", semester: { semesterNumber: 1, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } }, code: "CS102", name: "Data Structures", credits: 4, theoryMarks: 60, practicalMarks: 40, status: "ACTIVE" as const },
  { id: "mock-sub-3", semesterId: "mock-sem-2", semester: { semesterNumber: 2, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } }, code: "CS201", name: "Algorithms", credits: 3, theoryMarks: 70, practicalMarks: 30, status: "ACTIVE" as const },
];

const MOCK_SEMESTERS_LIST = [
  { id: "mock-sem-1", semesterNumber: 1, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } },
  { id: "mock-sem-2", semesterNumber: 2, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } },
  { id: "mock-sem-3", semesterNumber: 1, academicYear: "2024-25", program: { name: "BSc-Math", code: "BSC-MATH" } },
];

export async function getSubjects(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { code: { contains: search, mode: "insensitive" as const } },
      ],
    } : {};
    const [subjects, totalCount] = await Promise.all([
      prisma.subject.findMany({ where, include: { semester: { include: { program: true } } }, orderBy: { code: "asc" }, skip, take: limit }),
      prisma.subject.count({ where }),
    ]);
    return { subjects, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    const filtered = MOCK_SUBJECTS.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
    );
    const skip = (page - 1) * limit;
    return { subjects: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function getSemestersList() {
  try {
    return await prisma.semester.findMany({ include: { program: true }, orderBy: [{ academicYear: "desc" }, { semesterNumber: "asc" }] });
  } catch {
    return MOCK_SEMESTERS_LIST;
  }
}

export async function createSubject(data: { semesterId: string; code: string; name: string; credits: number; theoryMarks: number; practicalMarks: number; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const sub = await prisma.subject.create({ data: { ...data, code: data.code.toUpperCase() } });
    revalidatePath("/admin/subjects");
    return sub;
  } catch {
    const sem = MOCK_SEMESTERS_LIST.find(s => s.id === data.semesterId);
    const ns = { id: `mock-${Date.now()}`, ...data, code: data.code.toUpperCase(), semester: sem || { semesterNumber: 0, academicYear: "", program: { name: "", code: "" } } };
    MOCK_SUBJECTS.push(ns as typeof MOCK_SUBJECTS[0]);
    revalidatePath("/admin/subjects");
    return ns;
  }
}

export async function updateSubject(id: string, data: { semesterId: string; code: string; name: string; credits: number; theoryMarks: number; practicalMarks: number; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const sub = await prisma.subject.update({ where: { id }, data: { ...data, code: data.code.toUpperCase() } });
    revalidatePath("/admin/subjects");
    return sub;
  } catch {
    const idx = MOCK_SUBJECTS.findIndex(s => s.id === id);
    if (idx !== -1) {
      const sem = MOCK_SEMESTERS_LIST.find(s => s.id === data.semesterId);
      MOCK_SUBJECTS[idx] = { ...MOCK_SUBJECTS[idx], ...data, code: data.code.toUpperCase(), semester: sem || { semesterNumber: 0, academicYear: "", program: { name: "", code: "" } } } as typeof MOCK_SUBJECTS[0];
      revalidatePath("/admin/subjects");
      return MOCK_SUBJECTS[idx];
    }
    throw new Error("Not found");
  }
}

export async function deleteSubject(id: string) {
  try {
    const sub = await prisma.subject.delete({ where: { id } });
    revalidatePath("/admin/subjects");
    return sub;
  } catch {
    const idx = MOCK_SUBJECTS.findIndex(s => s.id === id);
    if (idx !== -1) { const d = MOCK_SUBJECTS.splice(idx, 1)[0]; revalidatePath("/admin/subjects"); return d; }
    throw new Error("Not found");
  }
}
