# 10-Implementation-Tickets.md

# College ERP --- Engineering Ticket Plan

This document breaks the project into implementation tickets. Complete
one ticket at a time and keep the application deployable after each
ticket.

------------------------------------------------------------------------

## Ticket Template

### Ticket ID

Example: ERP-001

### Objective

A one-line goal.

### Scope

What should be implemented.

### Database

Tables affected.

### APIs

Endpoints required.

### UI

Screens/components involved.

### Acceptance Criteria

-   Functional requirements
-   Validation
-   Authorization
-   Responsive UI
-   Error handling

### Definition of Done

-   Code merged
-   Tests pass
-   Build succeeds
-   Deployed

------------------------------------------------------------------------

# Sprint 0 --- Foundation

## ERP-001 Project Initialization

**Objective** Initialize the project.

**Scope** - Next.js 15 - TypeScript - Tailwind CSS - shadcn/ui -
ESLint - Prettier - Folder structure

**Acceptance Criteria** - Project runs locally - CI build succeeds

------------------------------------------------------------------------

## ERP-002 Infrastructure

**Scope** - Prisma - Supabase - Clerk - Environment variables - Vercel
configuration

------------------------------------------------------------------------

## ERP-003 Authentication

**Scope** - Clerk authentication - Middleware - Role-based routing

------------------------------------------------------------------------

# Sprint 1 --- Core UI

## ERP-004 Dashboard Layout

-   Sidebar
-   Navbar
-   Breadcrumbs
-   Theme
-   Responsive layout

## ERP-005 Shared Components

Create reusable: - Button - Input - Select - Dialog - DataTable -
Pagination - SearchBar - StatusBadge - Avatar

------------------------------------------------------------------------

# Sprint 2 --- Academic Master Data

## ERP-006 Department Module

Database: - Department

API: - CRUD

UI: - Department List - Create - Edit

------------------------------------------------------------------------

## ERP-007 Program Module

Database: - AcademicProgram

API: - CRUD

------------------------------------------------------------------------

## ERP-008 Semester Module

Database: - Semester

API: - CRUD

------------------------------------------------------------------------

## ERP-009 Section Module

Database: - Section

API: - CRUD

------------------------------------------------------------------------

## ERP-010 Subject Module

Database: - Subject

API: - CRUD

------------------------------------------------------------------------

## ERP-011 Classroom Module

Database: - Classroom

API: - CRUD

------------------------------------------------------------------------

# Sprint 3 --- User Management

## ERP-012 Faculty Module

Features: - CRUD - Profile image upload - Search - Filters

------------------------------------------------------------------------

## ERP-013 Student Module

Features: - CRUD - Profile image upload - Batch - Section - Program
assignment

------------------------------------------------------------------------

## ERP-014 Profile Pages

-   Admin
-   Faculty
-   Student

------------------------------------------------------------------------

# Sprint 4 --- Teaching

## ERP-015 Teaching Assignment

## ERP-016 Timetable

## ERP-017 Attendance

## ERP-018 Attendance Reports

------------------------------------------------------------------------

# Sprint 5 --- Examination

## ERP-019 Exam Management

## ERP-020 Student Assessment

## ERP-021 SGPA Calculation

## ERP-022 CGPA Calculation

------------------------------------------------------------------------

# Sprint 6 --- Campus Features

## ERP-023 Assignment Module

## ERP-024 Announcement Module

## ERP-025 Event Module

------------------------------------------------------------------------

# Sprint 7 --- Dashboard & Search

## ERP-026 Admin Dashboard

## ERP-027 Faculty Dashboard

## ERP-028 Student Dashboard

## ERP-029 Global Search

## ERP-030 Analytics

------------------------------------------------------------------------

# Sprint 8 --- Production

## ERP-031 Responsive Polish

## ERP-032 Performance Optimization

## ERP-033 Accessibility

## ERP-034 Testing

## ERP-035 Production Release

------------------------------------------------------------------------

# Rules for AI

Before implementing any ticket:

1.  Read all attached documentation.
2.  Implement **only the requested ticket**.
3.  Do not modify unrelated modules.
4.  Follow the database and API design exactly.
5.  Reuse existing components.
6.  Ensure the project builds successfully before finishing.
