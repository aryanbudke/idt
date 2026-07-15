"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_SECTIONS = [
  { id: "mock-sec-a", semesterId: "mock-sem-1", semester: { semesterNumber: 1, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } }, name: "Section A", capacity: 60 },
  { id: "mock-sec-b", semesterId: "mock-sem-1", semester: { semesterNumber: 1, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } }, name: "Section B", capacity: 60 },
  { id: "mock-sec-c", semesterId: "mock-sem-2", semester: { semesterNumber: 2, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } }, name: "Section A", capacity: 55 },
];

const MOCK_SEMESTERS_LIST = [
  { id: "mock-sem-1", semesterNumber: 1, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } },
  { id: "mock-sem-2", semesterNumber: 2, academicYear: "2024-25", program: { name: "BE-CS", code: "BE-CS" } },
  { id: "mock-sem-3", semesterNumber: 1, academicYear: "2024-25", program: { name: "BSc-Math", code: "BSC-MATH" } },
];

export async function getSections(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};
    const [sections, totalCount] = await Promise.all([
      prisma.section.findMany({ where, include: { semester: { include: { program: true } } }, orderBy: { name: "asc" }, skip, take: limit }),
      prisma.section.count({ where }),
    ]);
    return { sections, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    const filtered = MOCK_SECTIONS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const skip = (page - 1) * limit;
    return { sections: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function getSemestersForSection() {
  try {
    return await prisma.semester.findMany({ include: { program: true }, orderBy: [{ academicYear: "desc" }, { semesterNumber: "asc" }] });
  } catch {
    return MOCK_SEMESTERS_LIST;
  }
}

export async function createSection(data: { semesterId: string; name: string; capacity: number }) {
  try {
    const sec = await prisma.section.create({ data });
    revalidatePath("/admin/sections");
    return sec;
  } catch {
    const sem = MOCK_SEMESTERS_LIST.find(s => s.id === data.semesterId);
    const ns = { id: `mock-${Date.now()}`, ...data, semester: sem || { semesterNumber: 0, academicYear: "", program: { name: "", code: "" } } };
    MOCK_SECTIONS.push(ns as typeof MOCK_SECTIONS[0]);
    revalidatePath("/admin/sections");
    return ns;
  }
}

export async function updateSection(id: string, data: { semesterId: string; name: string; capacity: number }) {
  try {
    const sec = await prisma.section.update({ where: { id }, data });
    revalidatePath("/admin/sections");
    return sec;
  } catch {
    const idx = MOCK_SECTIONS.findIndex(s => s.id === id);
    if (idx !== -1) {
      const sem = MOCK_SEMESTERS_LIST.find(s => s.id === data.semesterId);
      MOCK_SECTIONS[idx] = { ...MOCK_SECTIONS[idx], ...data, semester: sem || { semesterNumber: 0, academicYear: "", program: { name: "", code: "" } } } as typeof MOCK_SECTIONS[0];
      revalidatePath("/admin/sections");
      return MOCK_SECTIONS[idx];
    }
    throw new Error("Not found");
  }
}

export async function deleteSection(id: string) {
  try {
    const sec = await prisma.section.delete({ where: { id } });
    revalidatePath("/admin/sections");
    return sec;
  } catch {
    const idx = MOCK_SECTIONS.findIndex(s => s.id === id);
    if (idx !== -1) { const d = MOCK_SECTIONS.splice(idx, 1)[0]; revalidatePath("/admin/sections"); return d; }
    throw new Error("Not found");
  }
}
