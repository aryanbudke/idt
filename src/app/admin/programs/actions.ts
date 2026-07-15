"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// ── Mock fallback data ──────────────────────────────────────────────────────
const MOCK_PROGRAMS = [
  { id: "mock-cs-be", name: "Bachelor of Engineering – Computer Science", code: "BE-CS", departmentId: "mock-cs", department: { name: "Computer Science", code: "CS" }, durationYears: 4, totalSemesters: 8, description: "Undergraduate program in CS & Engineering", status: "ACTIVE" as const },
  { id: "mock-math-bsc", name: "Bachelor of Science – Mathematics", code: "BSC-MATH", departmentId: "mock-math", department: { name: "Mathematics", code: "MATH" }, durationYears: 3, totalSemesters: 6, description: "Undergraduate program in Pure Mathematics", status: "ACTIVE" as const },
  { id: "mock-phys-bsc", name: "Bachelor of Science – Physics", code: "BSC-PHYS", departmentId: "mock-phys", department: { name: "Physics", code: "PHYS" }, durationYears: 3, totalSemesters: 6, description: "Undergraduate program in Applied Physics", status: "INACTIVE" as const },
];

const MOCK_DEPARTMENTS_LIST = [
  { id: "mock-cs", name: "Computer Science", code: "CS" },
  { id: "mock-math", name: "Mathematics", code: "MATH" },
  { id: "mock-phys", name: "Physics", code: "PHYS" },
];

export async function getPrograms(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { code: { contains: search, mode: "insensitive" as const } },
      ],
    } : {};

    const [programs, totalCount] = await Promise.all([
      prisma.academicProgram.findMany({ where, include: { department: true }, orderBy: { code: "asc" }, skip, take: limit }),
      prisma.academicProgram.count({ where }),
    ]);

    return { programs, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    const filtered = MOCK_PROGRAMS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    );
    const skip = (page - 1) * limit;
    return { programs: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function getDepartmentsList() {
  try {
    return await prisma.department.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, code: true } });
  } catch {
    return MOCK_DEPARTMENTS_LIST;
  }
}

export async function createProgram(data: { name: string; code: string; departmentId: string; durationYears: number; totalSemesters: number; description?: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const prog = await prisma.academicProgram.create({
      data: { name: data.name, code: data.code.toUpperCase(), departmentId: data.departmentId, durationYears: data.durationYears, totalSemesters: data.totalSemesters, description: data.description || null, status: data.status },
    });
    revalidatePath("/admin/programs");
    return prog;
  } catch {
    const dep = MOCK_DEPARTMENTS_LIST.find(d => d.id === data.departmentId);
    const np = { id: `mock-${Date.now()}`, ...data, code: data.code.toUpperCase(), description: data.description || null, department: dep || { name: "", code: "" } };
    MOCK_PROGRAMS.push(np as typeof MOCK_PROGRAMS[0]);
    revalidatePath("/admin/programs");
    return np;
  }
}

export async function updateProgram(id: string, data: { name: string; code: string; departmentId: string; durationYears: number; totalSemesters: number; description?: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const prog = await prisma.academicProgram.update({ where: { id }, data: { name: data.name, code: data.code.toUpperCase(), departmentId: data.departmentId, durationYears: data.durationYears, totalSemesters: data.totalSemesters, description: data.description || null, status: data.status } });
    revalidatePath("/admin/programs");
    return prog;
  } catch {
    const idx = MOCK_PROGRAMS.findIndex(p => p.id === id);
    if (idx !== -1) {
      const dep = MOCK_DEPARTMENTS_LIST.find(d => d.id === data.departmentId);
      MOCK_PROGRAMS[idx] = { ...MOCK_PROGRAMS[idx], ...data, code: data.code.toUpperCase(), description: data.description || null, department: dep || { name: "", code: "" } } as typeof MOCK_PROGRAMS[0];
      revalidatePath("/admin/programs");
      return MOCK_PROGRAMS[idx];
    }
    throw new Error("Not found");
  }
}

export async function deleteProgram(id: string) {
  try {
    const prog = await prisma.academicProgram.delete({ where: { id } });
    revalidatePath("/admin/programs");
    return prog;
  } catch {
    const idx = MOCK_PROGRAMS.findIndex(p => p.id === id);
    if (idx !== -1) { const d = MOCK_PROGRAMS.splice(idx, 1)[0]; revalidatePath("/admin/programs"); return d; }
    throw new Error("Not found");
  }
}
