"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_ANNOUNCEMENTS = [
  { id: "mock-ann-1", organizationId: "org-1", title: "Mid-Term Exam Schedule Released", description: "The mid-term examination schedule for all programs has been released. Students are advised to check the portal.", audience: "ALL" as const, publishDate: new Date("2024-10-01"), expiryDate: new Date("2024-11-30"), createdBy: "admin-1", author: { firstName: "Admin", lastName: "User" }, status: "ACTIVE" as const },
  { id: "mock-ann-2", organizationId: "org-1", title: "Library Maintenance Notice", description: "The library will be closed for maintenance on 15th October 2024.", audience: "STUDENT" as const, publishDate: new Date("2024-10-05"), expiryDate: new Date("2024-10-16"), createdBy: "admin-1", author: { firstName: "Admin", lastName: "User" }, status: "ACTIVE" as const },
  { id: "mock-ann-3", organizationId: "org-1", title: "Faculty Development Workshop", description: "A workshop on modern pedagogy will be held for all faculty members on 20th October.", audience: "FACULTY" as const, publishDate: new Date("2024-10-10"), expiryDate: new Date("2024-10-21"), createdBy: "admin-1", author: { firstName: "Admin", lastName: "User" }, status: "ACTIVE" as const },
];

export async function getAnnouncements(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }, { description: { contains: search, mode: "insensitive" as const } }] } : {};
    const [announcements, totalCount] = await Promise.all([
      prisma.announcement.findMany({ where, include: { author: true }, orderBy: { publishDate: "desc" }, skip, take: limit }),
      prisma.announcement.count({ where }),
    ]);
    return { announcements, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    const filtered = MOCK_ANNOUNCEMENTS.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()));
    const skip = (page - 1) * limit;
    return { announcements: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function createAnnouncement(data: { title: string; description: string; audience: "ALL" | "STUDENT" | "FACULTY" | "ADMIN"; publishDate: string; expiryDate: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const org = await prisma.organization.findFirst();
    const user = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!org || !user) throw new Error("Org or user not found");
    const ann = await prisma.announcement.create({ data: { organizationId: org.id, title: data.title, description: data.description, audience: data.audience, publishDate: new Date(data.publishDate), expiryDate: new Date(data.expiryDate), createdBy: user.id, status: data.status } });
    revalidatePath("/admin/announcements");
    return ann;
  } catch {
    const na = { id: `mock-${Date.now()}`, organizationId: "org-1", ...data, publishDate: new Date(data.publishDate), expiryDate: new Date(data.expiryDate), createdBy: "admin-1", author: { firstName: "Admin", lastName: "User" } };
    MOCK_ANNOUNCEMENTS.push(na as typeof MOCK_ANNOUNCEMENTS[0]);
    revalidatePath("/admin/announcements");
    return na;
  }
}

export async function updateAnnouncement(id: string, data: { title: string; description: string; audience: "ALL" | "STUDENT" | "FACULTY" | "ADMIN"; publishDate: string; expiryDate: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const ann = await prisma.announcement.update({ where: { id }, data: { title: data.title, description: data.description, audience: data.audience, publishDate: new Date(data.publishDate), expiryDate: new Date(data.expiryDate), status: data.status } });
    revalidatePath("/admin/announcements");
    return ann;
  } catch {
    const idx = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === id);
    if (idx !== -1) {
      MOCK_ANNOUNCEMENTS[idx] = { ...MOCK_ANNOUNCEMENTS[idx], ...data, publishDate: new Date(data.publishDate), expiryDate: new Date(data.expiryDate) } as typeof MOCK_ANNOUNCEMENTS[0];
      revalidatePath("/admin/announcements");
      return MOCK_ANNOUNCEMENTS[idx];
    }
    throw new Error("Not found");
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const ann = await prisma.announcement.delete({ where: { id } });
    revalidatePath("/admin/announcements");
    return ann;
  } catch {
    const idx = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === id);
    if (idx !== -1) { const d = MOCK_ANNOUNCEMENTS.splice(idx, 1)[0]; revalidatePath("/admin/announcements"); return d; }
    throw new Error("Not found");
  }
}
