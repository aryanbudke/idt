import { PrismaClient, Status, Role, StudentStatus, FacultyStatus, ClassroomType, AudienceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing data (in reverse order of dependencies)
  console.log("Cleaning existing database records...");
  await prisma.studentAssessment.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.timetable.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.teachingAssignment.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.faculty.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.semester.deleteMany({});
  await prisma.academicProgram.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.classroom.deleteMany({});
  await prisma.campus.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.organization.deleteMany({});

  // 2. Create Organization
  console.log("Creating Organization...");
  const org = await prisma.organization.create({
    data: {
      name: "Modern College of Engineering",
      code: "MCOE",
      email: "info@mcoe.edu",
      phone: "+1 555 0100",
      website: "https://mcoe.edu",
      status: Status.ACTIVE,
    },
  });

  // 3. Create Campus
  console.log("Creating Campus...");
  const campus = await prisma.campus.create({
    data: {
      organizationId: org.id,
      name: "Main Campus",
      address: "123 University Ave",
      city: "Boston",
      state: "MA",
      country: "USA",
      postalCode: "02115",
      phone: "+1 555 0101",
      email: "campus@mcoe.edu",
      status: Status.ACTIVE,
    },
  });

  // 4. Create Classrooms
  console.log("Creating Classrooms...");
  const classroom1 = await prisma.classroom.create({
    data: {
      campusId: campus.id,
      roomCode: "LH-101",
      building: "Science Block",
      floor: 1,
      capacity: 60,
      roomType: ClassroomType.CLASSROOM,
      status: Status.ACTIVE,
    },
  });

  const classroom2 = await prisma.classroom.create({
    data: {
      campusId: campus.id,
      roomCode: "LAB-202",
      building: "Engineering Block",
      floor: 2,
      capacity: 30,
      roomType: ClassroomType.LAB,
      status: Status.ACTIVE,
    },
  });

  // 5. Create Departments
  console.log("Creating Departments...");
  const csDept = await prisma.department.create({
    data: {
      campusId: campus.id,
      name: "Computer Science",
      code: "CS",
      description: "Department of Computer Science & Engineering",
      status: Status.ACTIVE,
    },
  });

  const mathDept = await prisma.department.create({
    data: {
      campusId: campus.id,
      name: "Mathematics",
      code: "MATH",
      description: "Department of Mathematics & Statistics",
      status: Status.ACTIVE,
    },
  });

  // 6. Create Programs
  console.log("Creating Programs...");
  const csProgram = await prisma.academicProgram.create({
    data: {
      departmentId: csDept.id,
      name: "BE-CS",
      code: "BE-CS",
      durationYears: 4,
      totalSemesters: 8,
      description: "Bachelor of Engineering in Computer Science",
      status: Status.ACTIVE,
    },
  });

  const mathProgram = await prisma.academicProgram.create({
    data: {
      departmentId: mathDept.id,
      name: "BSc-Math",
      code: "BSC-MATH",
      durationYears: 3,
      totalSemesters: 6,
      description: "Bachelor of Science in Mathematics",
      status: Status.ACTIVE,
    },
  });

  // 7. Create Semesters
  console.log("Creating Semesters...");
  const csSem1 = await prisma.semester.create({
    data: {
      programId: csProgram.id,
      semesterNumber: 1,
      academicYear: "2024-25",
      status: Status.ACTIVE,
    },
  });

  const csSem3 = await prisma.semester.create({
    data: {
      programId: csProgram.id,
      semesterNumber: 3,
      academicYear: "2024-25",
      status: Status.ACTIVE,
    },
  });

  const mathSem1 = await prisma.semester.create({
    data: {
      programId: mathProgram.id,
      semesterNumber: 1,
      academicYear: "2024-25",
      status: Status.ACTIVE,
    },
  });

  // 8. Create Sections
  console.log("Creating Sections...");
  const csSecA = await prisma.section.create({
    data: {
      semesterId: csSem1.id,
      name: "Section A",
      capacity: 40,
    },
  });

  const csSecB = await prisma.section.create({
    data: {
      semesterId: csSem1.id,
      name: "Section B",
      capacity: 40,
    },
  });

  const csSecC = await prisma.section.create({
    data: {
      semesterId: csSem3.id,
      name: "Section A",
      capacity: 40,
    },
  });

  // 9. Create Subjects
  console.log("Creating Subjects...");
  const csSubject1 = await prisma.subject.create({
    data: {
      semesterId: csSem1.id,
      code: "CS101",
      name: "Introduction to Programming",
      credits: 4,
      theoryMarks: 60,
      practicalMarks: 40,
      status: Status.ACTIVE,
    },
  });

  const mathSubject1 = await prisma.subject.create({
    data: {
      semesterId: csSem1.id,
      code: "MA101",
      name: "Calculus",
      credits: 4,
      theoryMarks: 80,
      practicalMarks: 0,
      status: Status.ACTIVE,
    },
  });

  // 10. Create Admin User
  console.log("Creating Users (Admin, Faculty, Students)...");
  const adminUser = await prisma.user.create({
    data: {
      clerkUserId: "mock-admin-clerk-id",
      email: "admin@mcoe.edu",
      role: Role.ADMIN,
      isActive: true,
    },
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      employeeCode: "ADM-001",
      firstName: "Admin",
      lastName: "User",
      email: "admin@mcoe.edu",
      phone: "+1 555 9999",
    },
  });

  // 11. Create Faculty Users & Profiles
  const facSarahUser = await prisma.user.create({
    data: {
      clerkUserId: "mock-sarah-clerk-id",
      email: "sarah.mitchell@mcoe.edu",
      role: Role.FACULTY,
    },
  });

  const facSarah = await prisma.faculty.create({
    data: {
      userId: facSarahUser.id,
      facultyId: "FAC-2024-001",
      firstName: "Sarah",
      lastName: "Mitchell",
      email: "sarah.mitchell@mcoe.edu",
      phone: "+1 555 8001",
      designation: "Professor & HOD",
      joiningDate: new Date("2020-08-15"),
      departmentId: csDept.id,
      status: FacultyStatus.ACTIVE,
    },
  });

  // Set HOD of CS department
  await prisma.department.update({
    where: { id: csDept.id },
    data: { hodFacultyId: facSarah.id },
  });

  const facJamesUser = await prisma.user.create({
    data: {
      clerkUserId: "mock-james-clerk-id",
      email: "james.wilson@mcoe.edu",
      role: Role.FACULTY,
    },
  });

  const facJames = await prisma.faculty.create({
    data: {
      userId: facJamesUser.id,
      facultyId: "FAC-2024-002",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@mcoe.edu",
      phone: "+1 555 8002",
      designation: "Associate Professor & HOD",
      joiningDate: new Date("2021-01-10"),
      departmentId: mathDept.id,
      status: FacultyStatus.ACTIVE,
    },
  });

  // Set HOD of Math department
  await prisma.department.update({
    where: { id: mathDept.id },
    data: { hodFacultyId: facJames.id },
  });

  // 12. Create Student Users & Profiles
  const stuAliceUser = await prisma.user.create({
    data: {
      clerkUserId: "mock-alice-clerk-id",
      email: "alice@student.edu",
      role: Role.STUDENT,
    },
  });

  await prisma.student.create({
    data: {
      userId: stuAliceUser.id,
      studentId: "STU-2024-001",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@student.edu",
      phone: "+1 555 0201",
      gender: "Female",
      dateOfBirth: new Date("2005-03-15"),
      emergencyContact: "+1 555 9001",
      batch: 2024,
      departmentId: csDept.id,
      programId: csProgram.id,
      semesterId: csSem1.id,
      sectionId: csSecA.id,
      status: StudentStatus.ACTIVE,
    },
  });

  const stuBobUser = await prisma.user.create({
    data: {
      clerkUserId: "mock-bob-clerk-id",
      email: "bob@student.edu",
      role: Role.STUDENT,
    },
  });

  await prisma.student.create({
    data: {
      userId: stuBobUser.id,
      studentId: "STU-2024-002",
      firstName: "Bob",
      lastName: "Martinez",
      email: "bob@student.edu",
      phone: "+1 555 0202",
      gender: "Male",
      dateOfBirth: new Date("2005-06-20"),
      emergencyContact: "+1 555 9002",
      batch: 2024,
      departmentId: csDept.id,
      programId: csProgram.id,
      semesterId: csSem1.id,
      sectionId: csSecB.id,
      status: StudentStatus.ACTIVE,
    },
  });

  const stuCarolUser = await prisma.user.create({
    data: {
      clerkUserId: "mock-carol-clerk-id",
      email: "carol@student.edu",
      role: Role.STUDENT,
    },
  });

  await prisma.student.create({
    data: {
      userId: stuCarolUser.id,
      studentId: "STU-2023-001",
      firstName: "Carol",
      lastName: "Lee",
      email: "carol@student.edu",
      phone: "+1 555 0203",
      gender: "Female",
      dateOfBirth: new Date("2004-11-08"),
      emergencyContact: "+1 555 9003",
      batch: 2023,
      departmentId: mathDept.id,
      programId: mathProgram.id,
      semesterId: csSem3.id, // CS sem 3 maps mathematically
      sectionId: csSecC.id,
      status: StudentStatus.ACTIVE,
    },
  });

  // 13. Create Events
  console.log("Creating Events...");
  await prisma.event.createMany({
    data: [
      {
        organizationId: org.id,
        title: "Annual Cultural Fest",
        description: "A grand cultural festival featuring music, dance, drama and art exhibitions.",
        category: "Cultural",
        venue: "Main Auditorium",
        eventDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
        startTime: "10:00",
        endTime: "18:00",
        organizer: "Student Council",
        status: Status.ACTIVE,
      },
      {
        organizationId: org.id,
        title: "National Science Olympiad",
        description: "An inter-college science competition covering physics, chemistry and mathematics.",
        category: "Academic",
        venue: "Science Block",
        eventDate: new Date(new Date().setDate(new Date().getDate() + 12)), // 12 days from now
        startTime: "09:00",
        endTime: "17:00",
        organizer: "Science Department",
        status: Status.ACTIVE,
      },
      {
        organizationId: org.id,
        title: "Sports Day 2026",
        description: "Annual sports day with competitions in athletics, cricket, basketball and more.",
        category: "Sports",
        venue: "Sports Ground",
        eventDate: new Date(new Date().setDate(new Date().getDate() + 20)), // 20 days from now
        startTime: "08:00",
        endTime: "16:00",
        organizer: "Sports Committee",
        status: Status.ACTIVE,
      },
    ],
  });

  // 14. Create Announcements
  console.log("Creating Announcements...");
  await prisma.announcement.create({
    data: {
      organizationId: org.id,
      title: "Welcome to Academic Year 2026-27",
      description: "We are excited to welcome all returning students and faculty back to campus for another great year of learning and growth.",
      audience: AudienceType.ALL,
      publishDate: new Date(),
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      createdBy: adminUser.id,
      status: Status.ACTIVE,
    },
  });

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
