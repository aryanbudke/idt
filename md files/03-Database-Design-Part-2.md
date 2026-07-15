# 03-Database-Design.md

# Part 2 --- Core Database Tables

This section defines the foundational entities of the College ERP. These
tables represent the organizational and academic hierarchy on which the
remaining modules depend.

------------------------------------------------------------------------

# 1. Organization

## Purpose

Represents a college or educational institution. The system supports
multiple organizations (multi-tenant architecture).

## Fields

  Field       Type       Notes
  ----------- ---------- ----------------------
  id          UUID       Primary Key
  name        String     Organization name
  code        String     Unique code
  email       String     Official email
  phone       String     Contact number
  website     String     Optional
  logoUrl     String     Supabase Storage URL
  status      Enum       ACTIVE / INACTIVE
  createdAt   DateTime   
  updatedAt   DateTime   

## Relationships

-   One Organization → Many Campuses

------------------------------------------------------------------------

# 2. Campus

## Purpose

Supports multiple campuses for one organization.

## Fields

  Field            Type
  ---------------- ----------
  id               UUID
  organizationId   FK
  name             String
  address          String
  city             String
  state            String
  country          String
  postalCode       String
  phone            String
  email            String
  status           Enum
  createdAt        DateTime
  updatedAt        DateTime

## Relationships

-   Belongs to Organization
-   Has many Departments

------------------------------------------------------------------------

# 3. Department

## Purpose

Stores academic departments.

Example:

-   Computer Science
-   Mechanical
-   Civil

## Fields

  Field          Type
  -------------- ---------------
  id             UUID
  campusId       FK
  name           String
  code           String
  hodFacultyId   FK (nullable)
  description    String
  status         Enum
  createdAt      DateTime
  updatedAt      DateTime

## Relationships

-   Belongs to Campus
-   Has many Programs
-   Has many Faculty
-   Has many Students

------------------------------------------------------------------------

# 4. Academic Program

## Purpose

Represents a degree program.

Examples:

-   B.Tech CSE
-   B.Tech AI
-   MCA
-   MBA

## Fields

  Field            Type
  ---------------- ----------
  id               UUID
  departmentId     FK
  name             String
  code             String
  durationYears    Integer
  totalSemesters   Integer
  description      String
  status           Enum
  createdAt        DateTime
  updatedAt        DateTime

## Relationships

-   Belongs to Department
-   Has many Semesters
-   Has many Students

------------------------------------------------------------------------

# 5. Semester

## Purpose

Represents an academic semester.

## Fields

  Field            Type
  ---------------- ----------
  id               UUID
  programId        FK
  semesterNumber   Integer
  academicYear     String
  status           Enum
  createdAt        DateTime
  updatedAt        DateTime

## Relationships

-   Belongs to Program
-   Has many Sections
-   Has many Subjects

------------------------------------------------------------------------

# 6. Section

## Purpose

Groups students within a semester.

Examples:

-   Section A
-   Section B

## Fields

  Field        Type
  ------------ ----------
  id           UUID
  semesterId   FK
  name         String
  capacity     Integer
  createdAt    DateTime
  updatedAt    DateTime

## Relationships

-   Belongs to Semester
-   Has many Students
-   Used in Timetable
-   Used in Attendance

------------------------------------------------------------------------

# 7. Subject

## Purpose

Represents an academic subject.

Examples:

-   DBMS
-   Operating Systems
-   Computer Networks

## Fields

  Field            Type
  ---------------- ----------
  id               UUID
  semesterId       FK
  code             String
  name             String
  credits          Integer
  theoryMarks      Integer
  practicalMarks   Integer
  status           Enum
  createdAt        DateTime
  updatedAt        DateTime

## Relationships

-   Belongs to Semester
-   Has many Teaching Assignments
-   Has many Exams
-   Has many Assignments

------------------------------------------------------------------------

# 8. User

## Purpose

Stores authentication identity for Clerk.

Student, Faculty and Admin profiles are linked to this table.

## Fields

  Field         Type
  ------------- --------------------------------
  id            UUID
  clerkUserId   String
  email         String
  role          Enum (ADMIN, FACULTY, STUDENT)
  lastLoginAt   DateTime
  isActive      Boolean
  createdAt     DateTime
  updatedAt     DateTime

## Relationships

-   One User → One Student (optional)
-   One User → One Faculty (optional)
-   One User → One Admin (optional)

------------------------------------------------------------------------

# Core Relationship Diagram

``` text
Organization
      │
      ▼
Campus
      │
      ▼
Department
      │
      ▼
Academic Program
      │
      ▼
Semester
      │
      ▼
Section
      │
      ├──────────► Students
      │
      ▼
Subject
      │
      ▼
Teaching Assignment
```

------------------------------------------------------------------------

# Design Notes

-   UUIDs are used as primary keys.
-   All foreign keys will be indexed.
-   Soft delete is implemented through status fields.
-   Images are stored in Supabase Storage; only URLs are stored in the
    database.
-   Clerk manages authentication while the User table stores application
    roles.

------------------------------------------------------------------------

## Next (Part 3)

Part 3 will define:

-   Student
-   Faculty
-   Admin
-   TeachingAssignment
-   Attendance
-   Timetable
