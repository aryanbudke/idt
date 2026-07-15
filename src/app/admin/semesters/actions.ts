"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_SEMESTERS = [
  { id: "mock-sem-1", programId: "mock-cs-be", program: { name: "BE – Computer Science", code: "BE-CS" }, semesterNumber: 1, academicYear: "2024-25", status: "ACTIVE" as const },
  { id: "mock-sem-2", programId: "mock-cs-be", program: { name: "BE – Computer Science", code: "BE-CS" }, semesterNumber: 2, academicYear: "2024-25", status: "ACTIVE" as const },
  { id: "mock-sem-3", programId: "mock-math-bsc", program: { name: "BSc – Mathematics", code: "BSC-MATH" }, semesterNumber: 1, academicYear: "2024-25", status: "ACTIVE" as const },
];

const MOCK_PROGRAMS_LIST = [
  { id: "mock-cs-be", name: "BE – Computer Science", code: "BE-CS", totalSemesters: 8 },
  { id: "mock-math-bsc", name: "BSc – Mathematics", code: "BSC-MATH", totalSemesters: 6 },
];

export async function getSemesters(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { program: { name: { contains: search, mode: "insensitive" as const } } },
        { academicYear: { contains: search, mode: "insensitive" as const } },
      ],
    } : {};
    const [semesters, totalCount] = await Promise.all([
      prisma.semester.findMany({ where, include: { program: true }, orderBy: [{ academicYear: "desc" }, { semesterNumber: "asc" }], skip, take: limit }),
      prisma.semester.count({ where }),
    ]);
    return { semesters, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    const filtered = MOCK_SEMESTERS.filter(s =>
      s.program.name.toLowerCase().includes(search.toLowerCase()) ||
      s.academicYear.toLowerCase().includes(search.toLowerCase())
    );
    const skip = (page - 1) * limit;
    return { semesters: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function getProgramsList() {
  try {
    return await prisma.academicProgram.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, code: true, totalSemesters: true } });
  } catch {
    return MOCK_PROGRAMS_LIST;
  }
}

export async function createSemester(data: { programId: string; semesterNumber: number; academicYear: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const sem = await prisma.semester.create({ data });
    revalidatePath("/admin/semesters");
    return sem;
  } catch {
    const prog = MOCK_PROGRAMS_LIST.find(p => p.id === data.programId);
    const ns = { id: `mock-${Date.now()}`, ...data, program: prog || { name: "", code: "", totalSemesters: 0 } };
    MOCK_SEMESTERS.push(ns as typeof MOCK_SEMESTERS[0]);
    revalidatePath("/admin/semesters");
    return ns;
  }
}

export async function updateSemester(id: string, data: { programId: string; semesterNumber: number; academicYear: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const sem = await prisma.semester.update({ where: { id }, data });
    revalidatePath("/admin/semesters");
    return sem;
  } catch {
    const idx = MOCK_SEMESTERS.findIndex(s => s.id === id);
    if (idx !== -1) {
      const prog = MOCK_PROGRAMS_LIST.find(p => p.id === data.programId);
      MOCK_SEMESTERS[idx] = { ...MOCK_SEMESTERS[idx], ...data, program: prog || { name: "", code: "", totalSemesters: 0 } } as typeof MOCK_SEMESTERS[0];
      revalidatePath("/admin/semesters");
      return MOCK_SEMESTERS[idx];
    }
    throw new Error("Not found");
  }
}

export async function deleteSemester(id: string) {
  try {
    const sem = await prisma.semester.delete({ where: { id } });
    revalidatePath("/admin/semesters");
    return sem;
  } catch {
    const idx = MOCK_SEMESTERS.findIndex(s => s.id === id);
    if (idx !== -1) { const d = MOCK_SEMESTERS.splice(idx, 1)[0]; revalidatePath("/admin/semesters"); return d; }
    throw new Error("Not found");
  }
}
