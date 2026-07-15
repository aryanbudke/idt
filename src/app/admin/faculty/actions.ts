"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_FACULTY = [
  { id: "mock-sarah", userId: "u1", facultyId: "FAC-1021", firstName: "Sarah", lastName: "Mitchell", email: "s.mitchell@educore.edu", phone: "+1 (555) 0121", profileImageUrl: null, designation: "Professor & HOD", joiningDate: new Date("2018-08-15"), departmentId: "mock-cs", department: { name: "Computer Science", code: "CS" }, status: "ACTIVE" as const },
  { id: "mock-james", userId: "u2", facultyId: "FAC-1022", firstName: "James", lastName: "Wilson", email: "j.wilson@educore.edu", phone: "+1 (555) 0122", profileImageUrl: null, designation: "Associate Professor & HOD", joiningDate: new Date("2019-09-01"), departmentId: "mock-math", department: { name: "Mathematics", code: "MATH" }, status: "ACTIVE" as const },
  { id: "mock-robert", userId: "u3", facultyId: "FAC-1023", firstName: "Robert", lastName: "Chen", email: "r.chen@educore.edu", phone: "+1 (555) 0123", profileImageUrl: null, designation: "Assistant Professor", joiningDate: new Date("2021-01-10"), departmentId: "mock-cs", department: { name: "Computer Science", code: "CS" }, status: "ACTIVE" as const },
];

const MOCK_DEPARTMENTS = [
  { id: "mock-cs", name: "Computer Science", code: "CS" },
  { id: "mock-math", name: "Mathematics", code: "MATH" },
  { id: "mock-phys", name: "Physics", code: "PHYS" },
];

export async function getFaculty(search = "", departmentId = "", page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { facultyId: { contains: search, mode: "insensitive" } },
    ];
    if (departmentId) where.departmentId = departmentId;

    const [faculty, totalCount] = await Promise.all([
      prisma.faculty.findMany({ where, include: { department: true }, orderBy: { firstName: "asc" }, skip, take: limit }),
      prisma.faculty.count({ where }),
    ]);
    return { faculty, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    let filtered = MOCK_FACULTY;
    if (search) filtered = filtered.filter(f =>
      `${f.firstName} ${f.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.facultyId.toLowerCase().includes(search.toLowerCase())
    );
    if (departmentId) filtered = filtered.filter(f => f.departmentId === departmentId);
    const skip = (page - 1) * limit;
    return { faculty: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function getFacultyDepartments() {
  try {
    return await prisma.department.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, code: true } });
  } catch {
    return MOCK_DEPARTMENTS;
  }
}

export async function getFacultyById(id: string) {
  try {
    return await prisma.faculty.findUnique({ where: { id }, include: { department: true, user: true } });
  } catch {
    return MOCK_FACULTY.find(f => f.id === id) || null;
  }
}

export async function createFacultyMember(data: { facultyId: string; firstName: string; lastName: string; email: string; phone: string; designation: string; departmentId: string; joiningDate: string; status: "ACTIVE" | "ON_LEAVE" | "RESIGNED" }) {
  try {
    // Create user record first
    const user = await prisma.user.create({
      data: { clerkUserId: `auto_${Date.now()}`, email: data.email, role: "FACULTY", isActive: true }
    });
    const faculty = await prisma.faculty.create({
      data: { userId: user.id, facultyId: data.facultyId, firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, designation: data.designation, departmentId: data.departmentId, joiningDate: new Date(data.joiningDate), status: data.status }
    });
    revalidatePath("/admin/faculty");
    return faculty;
  } catch {
    const dep = MOCK_DEPARTMENTS.find(d => d.id === data.departmentId);
    const nf = { id: `mock-${Date.now()}`, userId: `u-${Date.now()}`, ...data, profileImageUrl: null, joiningDate: new Date(data.joiningDate), department: dep || { name: "", code: "" } };
    MOCK_FACULTY.push(nf as typeof MOCK_FACULTY[0]);
    revalidatePath("/admin/faculty");
    return nf;
  }
}

export async function updateFacultyMember(id: string, data: { firstName: string; lastName: string; email: string; phone: string; designation: string; departmentId: string; joiningDate: string; status: "ACTIVE" | "ON_LEAVE" | "RESIGNED" }) {
  try {
    const faculty = await prisma.faculty.update({ where: { id }, data: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, designation: data.designation, departmentId: data.departmentId, joiningDate: new Date(data.joiningDate), status: data.status } });
    revalidatePath("/admin/faculty");
    return faculty;
  } catch {
    const idx = MOCK_FACULTY.findIndex(f => f.id === id);
    if (idx !== -1) {
      const dep = MOCK_DEPARTMENTS.find(d => d.id === data.departmentId);
      MOCK_FACULTY[idx] = { ...MOCK_FACULTY[idx], ...data, joiningDate: new Date(data.joiningDate), department: dep || { name: "", code: "" } } as typeof MOCK_FACULTY[0];
      revalidatePath("/admin/faculty");
      return MOCK_FACULTY[idx];
    }
    throw new Error("Not found");
  }
}

export async function deleteFacultyMember(id: string) {
  try {
    const f = await prisma.faculty.delete({ where: { id } });
    revalidatePath("/admin/faculty");
    return f;
  } catch {
    const idx = MOCK_FACULTY.findIndex(f => f.id === id);
    if (idx !== -1) { const d = MOCK_FACULTY.splice(idx, 1)[0]; revalidatePath("/admin/faculty"); return d; }
    throw new Error("Not found");
  }
}
