"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

interface MockFaculty {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
}

interface MockCampus {
  id: string;
  name: string;
}

interface MockDepartment {
  id: string;
  name: string;
  code: string;
  hodFacultyId: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  hod: MockFaculty | null;
  campus: MockCampus | null;
}

// Mock Fallback Data (used when database is offline/unreachable)
const MOCK_DEPARTMENTS: MockDepartment[] = [
  {
    id: "mock-cs",
    name: "Computer Science",
    code: "CS",
    hodFacultyId: "mock-sarah",
    description: "Department of Computer Science & Engineering",
    status: "ACTIVE" as const,
    hod: {
      id: "mock-sarah",
      firstName: "Sarah",
      lastName: "Mitchell",
      designation: "Professor & HOD",
    },
    campus: {
      id: "mock-campus",
      name: "Main Campus",
    },
  },
  {
    id: "mock-math",
    name: "Mathematics",
    code: "MATH",
    hodFacultyId: "mock-james",
    description: "Department of Mathematics & Statistics",
    status: "ACTIVE" as const,
    hod: {
      id: "mock-james",
      firstName: "James",
      lastName: "Wilson",
      designation: "Associate Professor & HOD",
    },
    campus: {
      id: "mock-campus",
      name: "Main Campus",
    },
  },
  {
    id: "mock-phys",
    name: "Physics",
    code: "PHYS",
    hodFacultyId: null,
    description: "Department of Physics & Applied Sciences",
    status: "ACTIVE" as const,
    hod: null,
    campus: {
      id: "mock-campus",
      name: "Main Campus",
    },
  },
];

const MOCK_FACULTIES: MockFaculty[] = [
  {
    id: "mock-sarah",
    firstName: "Sarah",
    lastName: "Mitchell",
    designation: "Professor & HOD",
  },
  {
    id: "mock-james",
    firstName: "James",
    lastName: "Wilson",
    designation: "Associate Professor & HOD",
  },
  {
    id: "mock-robert",
    firstName: "Robert",
    lastName: "Chen",
    designation: "Assistant Professor",
  },
];

// Helper to ensure database has default seed data in development
async function ensureMockData() {
  try {
    const orgCount = await prisma.organization.count();
    if (orgCount > 0) return;

    // Seed Organization
    const org = await prisma.organization.create({
      data: {
        name: "EduCore University",
        code: "EDUCORE",
        email: "info@educore.edu",
        phone: "+1 (555) 0199",
        website: "https://www.educore.edu",
        status: "ACTIVE",
      },
    });

    // Seed Campus
    const campus = await prisma.campus.create({
      data: {
        organizationId: org.id,
        name: "Main Campus",
        address: "123 University Avenue",
        city: "Metro City",
        state: "MC",
        country: "United States",
        postalCode: "12345",
        phone: "+1 (555) 0100",
        email: "main.campus@educore.edu",
        status: "ACTIVE",
      },
    });

    // Seed Departments (no HOD yet)
    const csDept = await prisma.department.create({
      data: {
        campusId: campus.id,
        name: "Computer Science",
        code: "CS",
        description: "Department of Computer Science & Engineering",
        status: "ACTIVE",
      },
    });

    const mathDept = await prisma.department.create({
      data: {
        campusId: campus.id,
        name: "Mathematics",
        code: "MATH",
        description: "Department of Mathematics & Statistics",
        status: "ACTIVE",
      },
    });

    await prisma.department.create({
      data: {
        campusId: campus.id,
        name: "Physics",
        code: "PHYS",
        description: "Department of Physics & Applied Sciences",
        status: "ACTIVE",
      },
    });

    // Seed HOD users and faculty members
    const csUser = await prisma.user.create({
      data: {
        clerkUserId: "mock_user_sarah",
        email: "s.mitchell@educore.edu",
        role: "FACULTY",
        isActive: true,
      },
    });

    const csFaculty = await prisma.faculty.create({
      data: {
        userId: csUser.id,
        facultyId: "FAC-1021",
        firstName: "Sarah",
        lastName: "Mitchell",
        email: "s.mitchell@educore.edu",
        phone: "+1 (555) 0121",
        designation: "Professor & HOD",
        joiningDate: new Date("2018-08-15"),
        departmentId: csDept.id,
        status: "ACTIVE",
      },
    });

    // Update department with HOD
    await prisma.department.update({
      where: { id: csDept.id },
      data: { hodFacultyId: csFaculty.id },
    });

    // Math HOD
    const mathUser = await prisma.user.create({
      data: {
        clerkUserId: "mock_user_james",
        email: "j.wilson@educore.edu",
        role: "FACULTY",
        isActive: true,
      },
    });

    const mathFaculty = await prisma.faculty.create({
      data: {
        userId: mathUser.id,
        facultyId: "FAC-1022",
        firstName: "James",
        lastName: "Wilson",
        email: "j.wilson@educore.edu",
        phone: "+1 (555) 0122",
        designation: "Associate Professor & HOD",
        joiningDate: new Date("2019-09-01"),
        departmentId: mathDept.id,
        status: "ACTIVE",
      },
    });

    await prisma.department.update({
      where: { id: mathDept.id },
      data: { hodFacultyId: mathFaculty.id },
    });
  } catch {
    console.warn("Database seeding skipped. Local server may be offline.");
  }
}

// Fetch all departments with pagination and search
export async function getDepartments(search = "", page = 1, limit = 5) {
  try {
    await ensureMockData();

    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { code: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [departments, totalCount] = await Promise.all([
      prisma.department.findMany({
        where: whereClause,
        include: {
          hod: true,
          campus: true,
        },
        orderBy: { code: "asc" },
        skip,
        take: limit,
      }),
      prisma.department.count({ where: whereClause }),
    ]);

    return {
      departments,
      totalPages: Math.ceil(totalCount / limit) || 1,
      totalCount,
    };
  } catch {
    console.warn("Database offline. Falling back to static mock data.");
    
    // Filter and search static mock data
    const filtered = MOCK_DEPARTMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase())
    );

    const skip = (page - 1) * limit;
    const departments = filtered.slice(skip, skip + limit);

    return {
      departments,
      totalPages: Math.ceil(filtered.length / limit) || 1,
      totalCount: filtered.length,
    };
  }
}

// Fetch all faculty members to use as HOD choices
export async function getFacultyList() {
  try {
    await ensureMockData();
    return await prisma.faculty.findMany({
      orderBy: { firstName: "asc" },
    });
  } catch {
    console.warn("Database offline. Returning static mock faculties.");
    return MOCK_FACULTIES;
  }
}

// Create a new Department
export async function createDepartment(data: {
  name: string;
  code: string;
  hodFacultyId?: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}) {
  try {
    const campus = await prisma.campus.findFirst();
    if (!campus) throw new Error("No campus found. Seed the database first.");

    const newDept = await prisma.department.create({
      data: {
        campusId: campus.id,
        name: data.name,
        code: data.code.toUpperCase(),
        hodFacultyId: data.hodFacultyId || null,
        description: data.description || null,
        status: data.status,
      },
    });

    revalidatePath("/admin/departments");
    return newDept;
  } catch {
    console.warn("Database offline. Creating mock department in-memory.");
    
    const mockHOD = MOCK_FACULTIES.find((f) => f.id === data.hodFacultyId) || null;
    const newMockDept: MockDepartment = {
      id: `mock-${Date.now()}`,
      name: data.name,
      code: data.code.toUpperCase(),
      hodFacultyId: data.hodFacultyId || null,
      description: data.description || null,
      status: data.status,
      hod: mockHOD,
      campus: { id: "mock-campus", name: "Main Campus" },
    };

    MOCK_DEPARTMENTS.push(newMockDept);
    revalidatePath("/admin/departments");
    return newMockDept;
  }
}

// Update an existing Department
export async function updateDepartment(
  id: string,
  data: {
    name: string;
    code: string;
    hodFacultyId?: string;
    description?: string;
    status: "ACTIVE" | "INACTIVE";
  }
) {
  try {
    const updatedDept = await prisma.department.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        hodFacultyId: data.hodFacultyId || null,
        description: data.description || null,
        status: data.status,
      },
    });

    revalidatePath("/admin/departments");
    return updatedDept;
  } catch {
    console.warn("Database offline. Updating mock department in-memory.");
    
    const index = MOCK_DEPARTMENTS.findIndex((d) => d.id === id);
    if (index !== -1) {
      const mockHOD = MOCK_FACULTIES.find((f) => f.id === data.hodFacultyId) || null;
      MOCK_DEPARTMENTS[index] = {
        ...MOCK_DEPARTMENTS[index],
        name: data.name,
        code: data.code.toUpperCase(),
        hodFacultyId: data.hodFacultyId || null,
        description: data.description || null,
        status: data.status,
        hod: mockHOD,
      };
      revalidatePath("/admin/departments");
      return MOCK_DEPARTMENTS[index];
    }
    throw new Error("Mock department not found for update");
  }
}

// Delete a Department
export async function deleteDepartment(id: string) {
  try {
    await prisma.department.update({
      where: { id },
      data: { hodFacultyId: null },
    });

    const deletedDept = await prisma.department.delete({
      where: { id },
    });

    revalidatePath("/admin/departments");
    return deletedDept;
  } catch {
    console.warn("Database offline. Deleting mock department in-memory.");
    
    const index = MOCK_DEPARTMENTS.findIndex((d) => d.id === id);
    if (index !== -1) {
      const deleted = MOCK_DEPARTMENTS[index];
      MOCK_DEPARTMENTS.splice(index, 1);
      revalidatePath("/admin/departments");
      return deleted;
    }
    throw new Error("Mock department not found for deletion");
  }
}
