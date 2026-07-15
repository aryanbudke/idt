"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const MOCK_EVENTS = [
  { id: "mock-evt-1", organizationId: "org-1", title: "Annual Cultural Fest", description: "A grand cultural festival featuring music, dance, drama and art exhibitions by students.", category: "Cultural", venue: "Main Auditorium", eventDate: new Date("2024-11-15"), startTime: "10:00", endTime: "18:00", organizer: "Student Council", status: "ACTIVE" as const },
  { id: "mock-evt-2", organizationId: "org-1", title: "National Science Olympiad", description: "An inter-college science competition covering physics, chemistry and mathematics.", category: "Academic", venue: "Science Block", eventDate: new Date("2024-12-05"), startTime: "09:00", endTime: "17:00", organizer: "Science Department", status: "ACTIVE" as const },
  { id: "mock-evt-3", organizationId: "org-1", title: "Sports Day 2024", description: "Annual sports day with competitions in athletics, cricket, basketball and more.", category: "Sports", venue: "Sports Ground", eventDate: new Date("2024-11-30"), startTime: "08:00", endTime: "16:00", organizer: "Sports Committee", status: "ACTIVE" as const },
];

export async function getEvents(search = "", page = 1, limit = 5) {
  try {
    const skip = (page - 1) * limit;
    const where = search ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }, { category: { contains: search, mode: "insensitive" as const } }] } : {};
    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({ where, orderBy: { eventDate: "asc" }, skip, take: limit }),
      prisma.event.count({ where }),
    ]);
    return { events, totalPages: Math.ceil(totalCount / limit) || 1, totalCount };
  } catch {
    const filtered = MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
    const skip = (page - 1) * limit;
    return { events: filtered.slice(skip, skip + limit), totalPages: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length };
  }
}

export async function createEvent(data: { title: string; description: string; category: string; venue: string; eventDate: string; startTime: string; endTime: string; organizer: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const org = await prisma.organization.findFirst();
    if (!org) throw new Error("No org");
    const evt = await prisma.event.create({ data: { organizationId: org.id, title: data.title, description: data.description, category: data.category, venue: data.venue, eventDate: new Date(data.eventDate), startTime: data.startTime, endTime: data.endTime, organizer: data.organizer, status: data.status } });
    revalidatePath("/admin/events");
    return evt;
  } catch {
    const ne = { id: `mock-${Date.now()}`, organizationId: "org-1", ...data, eventDate: new Date(data.eventDate) };
    MOCK_EVENTS.push(ne as typeof MOCK_EVENTS[0]);
    revalidatePath("/admin/events");
    return ne;
  }
}

export async function updateEvent(id: string, data: { title: string; description: string; category: string; venue: string; eventDate: string; startTime: string; endTime: string; organizer: string; status: "ACTIVE" | "INACTIVE" }) {
  try {
    const evt = await prisma.event.update({ where: { id }, data: { title: data.title, description: data.description, category: data.category, venue: data.venue, eventDate: new Date(data.eventDate), startTime: data.startTime, endTime: data.endTime, organizer: data.organizer, status: data.status } });
    revalidatePath("/admin/events");
    return evt;
  } catch {
    const idx = MOCK_EVENTS.findIndex(e => e.id === id);
    if (idx !== -1) { MOCK_EVENTS[idx] = { ...MOCK_EVENTS[idx], ...data, eventDate: new Date(data.eventDate) } as typeof MOCK_EVENTS[0]; revalidatePath("/admin/events"); return MOCK_EVENTS[idx]; }
    throw new Error("Not found");
  }
}

export async function deleteEvent(id: string) {
  try {
    const evt = await prisma.event.delete({ where: { id } });
    revalidatePath("/admin/events");
    return evt;
  } catch {
    const idx = MOCK_EVENTS.findIndex(e => e.id === id);
    if (idx !== -1) { const d = MOCK_EVENTS.splice(idx, 1)[0]; revalidatePath("/admin/events"); return d; }
    throw new Error("Not found");
  }
}
