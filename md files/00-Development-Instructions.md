# 00-Development-Instructions.md

# College ERP Management System

Version: 1.0

## Objective

Build a production-ready College ERP Management System using the
attached documentation as the single source of truth.

Priority Order:

1.  Development Instructions
2.  PRD
3.  System Architecture
4.  Database Design
5.  API Design
6.  Stitch UI

------------------------------------------------------------------------

## Technology Stack

### Frontend

-   Next.js 15 (App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   React Hook Form
-   Zod
-   TanStack Table
-   Recharts

### Backend

-   Next.js Server Actions
-   Route Handlers
-   Prisma ORM

### Authentication

-   Clerk
-   Roles: Admin, Faculty, Student

### Database

-   PostgreSQL (Supabase)

### Storage

Supabase Storage Buckets

-   student-images
-   faculty-images

Only store image URLs in PostgreSQL.

### Deployment

-   GitHub
-   Vercel

------------------------------------------------------------------------

# Coding Standards

Use:

-   TypeScript
-   Functional Components
-   Server Components by default
-   Async/Await
-   Strict typing

Avoid:

-   any
-   inline styles
-   duplicate logic
-   unnecessary client components

------------------------------------------------------------------------

# Folder Structure

``` text
src/
├── app/
├── components/
├── features/
├── actions/
├── services/
├── lib/
├── hooks/
├── types/
├── validations/
└── middleware.ts
```

------------------------------------------------------------------------

# UI Rules

-   Match the Stitch design exactly.
-   Desktop, Tablet, and Mobile responsive.
-   Reuse components.

Reusable components:

-   Button
-   Input
-   Select
-   DataTable
-   Modal
-   SearchBar
-   Pagination
-   StatusBadge
-   Avatar

------------------------------------------------------------------------

# Forms

Use:

-   React Hook Form
-   Zod

Every form must support:

-   Validation
-   Loading
-   Success
-   Error
-   Disabled states

------------------------------------------------------------------------

# Data Tables

Support:

-   Pagination
-   Search
-   Sorting
-   Filtering
-   Bulk actions
-   Empty state
-   Loading skeleton

------------------------------------------------------------------------

# API Rules

Follow **04-API-Design.md** exactly.

Prefer Server Actions.

------------------------------------------------------------------------

# Database Rules

Follow **03-Database-Design.md** exactly.

Do not rename tables or fields without updating the architecture.

------------------------------------------------------------------------

# Authentication & Authorization

Use Clerk with middleware.

Admin: - Full access

Faculty: - Assigned subjects - Attendance - Timetable - Assignments

Student: - Attendance - Assessments - SGPA / CGPA - Timetable - Events -
Announcements

------------------------------------------------------------------------

# Error Handling

Every page must include:

-   Loading
-   Empty
-   Error
-   Permission Denied
-   Not Found

------------------------------------------------------------------------

# Performance

-   Server Components first
-   Optimize Prisma queries
-   Paginate large datasets
-   Optimize images

------------------------------------------------------------------------

# Security

-   Validate every request
-   Never trust client data
-   Role-based authorization
-   Protect all mutations

------------------------------------------------------------------------

# Git

Commit per feature.

Examples:

-   feat(auth)
-   feat(student)
-   feat(attendance)
-   fix(timetable)

------------------------------------------------------------------------

# Development Workflow

Implement modules in this order:

1.  Project Setup
2.  Authentication
3.  Dashboard
4.  Department
5.  Program
6.  Semester
7.  Section
8.  Subject
9.  Faculty
10. Student
11. Teaching Assignment
12. Timetable
13. Attendance
14. Exam
15. Student Assessment
16. Assignment
17. Announcement
18. Event
19. Reports
20. Global Search

Complete one module before starting the next.
