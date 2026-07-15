# 03-Database-Design.md

# Part 1 --- Database Foundation

## 1. Overview

### Purpose

The College ERP Database is designed to support a scalable, multi-tenant
academic management platform capable of managing multiple organizations,
campuses, departments, academic programs, faculty members, students,
examinations, attendance, assignments, events, notices, and timetables.

The database follows a normalized relational design to ensure data
consistency, reduce redundancy, and simplify future expansion.

------------------------------------------------------------------------

## Design Goals

-   Multi-College Support
-   Multi-Campus Support
-   Role-Based Authentication
-   Highly Normalized Database
-   Future AI Integration
-   High Performance
-   Secure Data Storage
-   Easy Scalability

------------------------------------------------------------------------

## Technology Stack

**Database:** PostgreSQL

**ORM:** Prisma ORM

**Hosting:** Supabase

------------------------------------------------------------------------

## Multi-Tenant Architecture

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
      ▼
Students
```

Every record belongs to an Organization, enabling multi-college support
without redesigning the schema.

------------------------------------------------------------------------

## Authentication Architecture

``` text
Clerk
      │
      ▼
User
 ┌────┴────┐
 │         │
 ▼         ▼
Student  Faculty
      │
      ▼
    Admin
```

The User table stores authentication and identity, while Student,
Faculty, and Admin store role-specific data.

------------------------------------------------------------------------

## Academic Hierarchy

``` text
Organization
↓
Campus
↓
Department
↓
Academic Program
↓
Semester
↓
Section
↓
Subject
```

Every student belongs to:

``` text
Organization
↓
Campus
↓
Department
↓
Academic Program
↓
Semester
↓
Section
```

------------------------------------------------------------------------

## Naming Convention

### Tables

Use singular names.

``` text
User
Student
Faculty
Department
Subject
```

### Primary Key

``` text
id (UUID)
```

### Foreign Keys

``` text
organizationId
campusId
departmentId
programId
semesterId
sectionId
subjectId
facultyId
studentId
userId
```

### Timestamps

``` text
createdAt
updatedAt
```

### Soft Delete

``` text
status
isActive
```

Student Status: - ACTIVE - GRADUATED - SUSPENDED

Faculty Status: - ACTIVE - ON_LEAVE - RESIGNED

------------------------------------------------------------------------

## File Storage Strategy

Profile images are stored in Supabase Storage.

``` text
student-images/
faculty-images/
```

The database stores only:

``` text
profileImageUrl
```

Future buckets:

``` text
assignment-files
notice-attachments
certificates
```

------------------------------------------------------------------------

## Global Search

Search supports:

-   Students
-   Faculty
-   Departments
-   Programs
-   Subjects
-   Events
-   Notices

------------------------------------------------------------------------

## Dashboard Roles

-   Admin
-   Faculty
-   Student

Each role accesses only its permitted data.

------------------------------------------------------------------------

## Academic Features

-   Attendance
-   Assignments
-   Examinations
-   Marks
-   SGPA
-   CGPA
-   Timetable
-   Events
-   Notices

------------------------------------------------------------------------

## Examination Types

-   Internal Assessment 1
-   Internal Assessment 2
-   Assignment
-   Lab
-   Semester End Examination

------------------------------------------------------------------------

## Marks Calculation

``` text
Total Marks
↓
Percentage
↓
Letter Grade
↓
Grade Points
↓
SGPA
↓
CGPA
```

------------------------------------------------------------------------

## Teaching Model

``` text
Subject
↓
Semester
↓
Section
```

Managed through the **TeachingAssignment** table.

------------------------------------------------------------------------

## Database Standards

-   PostgreSQL
-   Prisma ORM
-   UUID Primary Keys
-   Third Normal Form (3NF)
-   Indexed Foreign Keys
-   Multi-Tenant Ready
-   Clerk Authentication
-   Supabase Storage

------------------------------------------------------------------------

## Next (Part 2)

The next section will define the Organization, Campus, Department,
Academic Program, Semester, Section, Subject, and User tables with
fields, relationships, constraints, and indexes.
