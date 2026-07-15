"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_STUDENTS = [
  { id: "mock-stu-1", userId: "su1", studentId: "STU-2024-001", firstName: "Alice", lastName: "Johnson", email: "alice@student.edu", phone: "+1 555 0201", profileImageUrl: null, gender: "Female", dateOfBirth: new Date("2005-03-15"), emergencyContact: "+1 555 9001", batch: 2024, departmentId: "mock-cs", department: { name: "Computer Science", code: "CS" }, programId: "mock-cs-be", program: { name: "BE-CS", code: "BE-CS" }, semesterId: "mock-sem-1", semester: { semesterNumber: 1, academicYear: "2024-25" }, sectionId: "mock-sec-a", section: { name: "Section A" }, status: "ACTIVE" as const },
  { id: "mock-stu-2", userId: "su2", studentId: "STU-2024-002", firstName: "Bob", lastName: "Martinez", email: "bob@student.edu", phone: "+1 555 0202", profileImageUrl: null, gender: "Male", dateOfBirth: new Date("2005-06-20"), emergencyContact: "+1 555 9002", batch: 2024, departmentId: "mock-cs", department: { name: "Computer Science", code: "CS" }, programId: "mock-cs-be", program: { name: "BE-CS", code: "BE-CS" }, semesterId: "mock-sem-1", semester: { semesterNumber: 1, academicYear: "2024-25" }, sectionId: "mock-sec-b", section: { name: "Section B" }, status: "ACTIVE" as const },
  { id: "mock-stu-3", userId: "su3", studentId: "STU-2023-001", firstName: "Carol", lastName: "Lee", email: "carol@student.edu", phone: "+1 555 0203", profileImageUrl: null, gender: "Female", dateOfBirth: new Date("2004-11-08"), emergencyContact: "+1 555 9003", batch: 2023, departmentId: "mock-math", department: { name: "Mathematics", code: "MATH" }, programId: "mock-math-bsc", program: { name: "BSc-Math", code: "BSC-MATH" }, semesterId: "mock-sem-3", semester: { semesterNumber: 1, academicYear: "2024-25" }, sectionId: "mock-sec-c", section: { name: "Section A" }, status: "ACTIVE" as const },
];

const MOCK_DEPARTMENTS = [{ id: "mock-cs", name: "Computer Science", code: "CS" }, { id: "mock-math", name: "Mathematics", code: "MATH" }];

export async function getStudents(search = "", departmentId = "", page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { studentId: { contains: search, mode: "insensitive" } },
    ];
    if (departmentId) where.departmentId = departmentId;
    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({ where, include: { department: true, program: true, semester: true, section: true }, orderBy: { firstName: "asc" }, skip, take: limit }),
      prisma.student.count({ where }),
    ]);
    return { students, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    let filtered = MOCK_STUDENTS;
    if (search) filtered = filtered.filter(s => `${s.firstName} ${s.lastName} ${s.studentId} ${s.email}`.toLowerCase().includes(search.toLowerCase()));
    if (departmentId) filtered = filtered.filter(s => s.departmentId === departmentId);
    const skip = (page - 1) * limit;
    return { students: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function getStudentDepartments() {
  try {
    return await prisma.department.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, code: true } });
  } catch {
    return MOCK_DEPARTMENTS;
  }
}

export async function getStudentById(id: string) {
  try {
    return await prisma.student.findUnique({ where: { id }, include: { department: true, program: true, semester: true, section: true, user: true } });
  } catch {
    return MOCK_STUDENTS.find(s => s.id === id) || null;
  }
}

export async function deleteStudent(id: string) {
  try {
    const s = await prisma.student.delete({ where: { id } });
    revalidatePath("/admin/students");
    return s;
  } catch {
    const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (idx !== -1) { const d = MOCK_STUDENTS.splice(idx, 1)[0]; revalidatePath("/admin/students"); return d; }
    throw new Error("Not found");
  }
}
