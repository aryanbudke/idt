"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_CLASSROOMS = [
  { id: "mock-cr-101", campusId: "mock-campus", campus: { name: "Main Campus" }, roomCode: "101", building: "Block A", floor: 1, capacity: 60, roomType: "CLASSROOM" as const, status: "ACTIVE" as const },
  { id: "mock-cr-lab1", campusId: "mock-campus", campus: { name: "Main Campus" }, roomCode: "LAB-01", building: "Block B", floor: 0, capacity: 30, roomType: "LAB" as const, status: "ACTIVE" as const },
  { id: "mock-cr-201", campusId: "mock-campus", campus: { name: "Main Campus" }, roomCode: "201", building: "Block A", floor: 2, capacity: 80, roomType: "CLASSROOM" as const, status: "ACTIVE" as const },
];

export async function getClassrooms(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { roomCode: { contains: search, mode: "insensitive" as const } },
        { building: { contains: search, mode: "insensitive" as const } },
      ],
    } : {};
    const [classrooms, totalCount] = await Promise.all([
      prisma.classroom.findMany({ where, include: { campus: true }, orderBy: [{ building: "asc" }, { roomCode: "asc" }], skip, take: limit }),
      prisma.classroom.count({ where }),
    ]);
    return { classrooms, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    const filtered = MOCK_CLASSROOMS.filter(c =>
      c.roomCode.toLowerCase().includes(search.toLowerCase()) ||
      c.building.toLowerCase().includes(search.toLowerCase())
    );
    const skip = (page - 1) * limit;
    return { classrooms: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function createClassroom(data: { roomCode: string; building: string; floor: number; capacity: number; roomType: "CLASSROOM" | "LAB"; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const campus = await prisma.campus.findFirst();
    if (!campus) throw new Error("No campus found");
    const cr = await prisma.classroom.create({ data: { campusId: campus.id, roomCode: data.roomCode.toUpperCase(), building: data.building, floor: data.floor, capacity: data.capacity, roomType: data.roomType, status: data.status } });
    revalidatePath("/admin/classrooms");
    return cr;
  } catch {
    const nc = { id: `mock-${Date.now()}`, campusId: "mock-campus", campus: { name: "Main Campus" }, roomCode: data.roomCode.toUpperCase(), building: data.building, floor: data.floor, capacity: data.capacity, roomType: data.roomType, status: data.status };
    MOCK_CLASSROOMS.push(nc as typeof MOCK_CLASSROOMS[0]);
    revalidatePath("/admin/classrooms");
    return nc;
  }
}

export async function updateClassroom(id: string, data: { roomCode: string; building: string; floor: number; capacity: number; roomType: "CLASSROOM" | "LAB"; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const cr = await prisma.classroom.update({ where: { id }, data: { roomCode: data.roomCode.toUpperCase(), building: data.building, floor: data.floor, capacity: data.capacity, roomType: data.roomType, status: data.status } });
    revalidatePath("/admin/classrooms");
    return cr;
  } catch {
    const idx = MOCK_CLASSROOMS.findIndex(c => c.id === id);
    if (idx !== -1) {
      MOCK_CLASSROOMS[idx] = { ...MOCK_CLASSROOMS[idx], ...data, roomCode: data.roomCode.toUpperCase() } as typeof MOCK_CLASSROOMS[0];
      revalidatePath("/admin/classrooms");
      return MOCK_CLASSROOMS[idx];
    }
    throw new Error("Not found");
  }
}

export async function deleteClassroom(id: string) {
  try {
    const cr = await prisma.classroom.delete({ where: { id } });
    revalidatePath("/admin/classrooms");
    return cr;
  } catch {
    const idx = MOCK_CLASSROOMS.findIndex(c => c.id === id);
    if (idx !== -1) { const d = MOCK_CLASSROOMS.splice(idx, 1)[0]; revalidatePath("/admin/classrooms"); return d; }
    throw new Error("Not found");
  }
}
