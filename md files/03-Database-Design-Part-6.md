# 03-Database-Design.md

# Part 6 --- Database Implementation Guide

This document bridges the gap between the database design and
implementation.

------------------------------------------------------------------------

# 1. Prisma Model Mapping

  Database Table        Prisma Model
  --------------------- --------------------
  Organization          Organization
  Campus                Campus
  Department            Department
  Academic Program      AcademicProgram
  Semester              Semester
  Section               Section
  Subject               Subject
  User                  User
  Student               Student
  Faculty               Faculty
  Admin                 Admin
  Teaching Assignment   TeachingAssignment
  Attendance            Attendance
  Timetable             Timetable
  Classroom             Classroom
  Exam                  Exam
  Student Assessment    StudentAssessment
  Assignment            Assignment
  Announcement          Announcement
  Event                 Event

------------------------------------------------------------------------

# 2. Prisma Folder Structure

``` text
prisma/
├── schema.prisma
├── migrations/
├── seed.ts
├── enums.prisma
└── README.md
```

------------------------------------------------------------------------

# 3. Migration Strategy

Development

``` bash
npx prisma migrate dev
```

Production

``` bash
npx prisma migrate deploy
```

Rules

-   One migration per logical change.
-   Never edit applied migrations.
-   Review generated SQL before deployment.

------------------------------------------------------------------------

# 4. Seed Strategy

Seed the following data:

-   Organization
-   Campus
-   Departments
-   Programs
-   Semesters
-   Sections
-   Subjects
-   Admin User
-   Sample Faculty
-   Sample Students
-   Sample Timetable

This provides a working development environment.

------------------------------------------------------------------------

# 5. Clerk Integration

Authentication is handled by Clerk.

Flow

``` text
Clerk Login
      │
      ▼
Clerk User ID
      │
      ▼
User Table
      │
      ├── Student
      ├── Faculty
      └── Admin
```

The database stores:

-   clerkUserId
-   role
-   profile relationships

Passwords are never stored in PostgreSQL.

------------------------------------------------------------------------

# 6. Supabase Storage

Buckets

``` text
student-images/
faculty-images/
```

Future

``` text
assignment-files/
notice-attachments/
certificates/
```

Database stores only:

``` text
profileImageUrl
```

------------------------------------------------------------------------

# 7. Naming Standards

Tables: - Singular names

Primary Keys: - id

Foreign Keys: - organizationId - campusId - departmentId - userId -
studentId - facultyId

Timestamps: - createdAt - updatedAt

------------------------------------------------------------------------

# 8. Development vs Production

Development

-   Local Prisma
-   Development Supabase Project
-   Seeded data

Production

-   Production Supabase
-   Migration deployment
-   Automated backups
-   Environment variables

------------------------------------------------------------------------

# 9. Security Guidelines

-   Clerk authentication
-   Role-based authorization
-   Validate all inputs
-   Never trust client-side data
-   Store secrets in environment variables
-   Use HTTPS in production

------------------------------------------------------------------------

# 10. Backup & Recovery

-   Daily database backups
-   Weekly storage backup
-   Migration history in Git
-   Test restoration periodically

------------------------------------------------------------------------

# 11. Testing Database

Create separate databases for:

-   Development
-   Testing
-   Production

Testing should never use production data.

------------------------------------------------------------------------

# 12. Database Versioning

Use semantic versioning.

Example

``` text
v1.0.0
Initial ERP Schema

v1.1.0
Event Module

v1.2.0
Reports Module

v2.0.0
AI Features
```

------------------------------------------------------------------------

# 13. Implementation Order

1.  Organization
2.  Campus
3.  Department
4.  AcademicProgram
5.  Semester
6.  Section
7.  Subject
8.  User
9.  Student
10. Faculty
11. Admin
12. Classroom
13. TeachingAssignment
14. Timetable
15. Attendance
16. Exam
17. StudentAssessment
18. Assignment
19. Announcement
20. Event

------------------------------------------------------------------------

# 14. Final Architecture Summary

``` text
Clerk
   │
   ▼
User
   │
   ├── Student
   ├── Faculty
   └── Admin

Organization
   │
Campus
   │
Department
   │
Academic Program
   │
Semester
   │
Section
   │
Subject
   │
TeachingAssignment
   │
├── Attendance
├── Timetable
├── Exam
└── Assignment

Exam
   │
StudentAssessment
   │
SGPA / CGPA
```

------------------------------------------------------------------------

# Completion Checklist

-   [x] Multi-tenant architecture
-   [x] Role-based authentication
-   [x] Academic hierarchy
-   [x] Normalized schema
-   [x] Soft delete strategy
-   [x] Supabase Storage integration
-   [x] Clerk integration
-   [x] Performance strategy
-   [x] Future scalability

------------------------------------------------------------------------

## Next Document

The next document is:

**docs/04-API-Design.md**

It will define every API endpoint, request, response, authorization
rule, validation, and error format before implementation begins.
