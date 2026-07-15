# 11-Coding-Standards.md

# College ERP --- Coding Standards

Version: 1.0

This document defines the engineering standards for the College ERP
project. Every generated feature must follow these rules.

------------------------------------------------------------------------

# 1. General Principles

-   Write clean, readable, maintainable code.
-   Prefer composition over duplication.
-   Keep business logic out of UI components.
-   Follow the existing project structure.
-   Implement only the requested scope.

------------------------------------------------------------------------

# 2. Technology Standards

  Layer            Standard
  ---------------- --------------------------
  Framework        Next.js 15 (App Router)
  Language         TypeScript (strict mode)
  Styling          Tailwind CSS
  UI               shadcn/ui
  Forms            React Hook Form + Zod
  ORM              Prisma
  Database         PostgreSQL (Supabase)
  Authentication   Clerk
  Storage          Supabase Storage

------------------------------------------------------------------------

# 3. Folder Structure

``` text
src/
├── app/
├── actions/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── types/
├── validations/
└── middleware.ts
```

Do not create additional top-level folders without approval.

------------------------------------------------------------------------

# 4. Naming Conventions

## Files

-   Components: `PascalCase.tsx`
-   Hooks: `useSomething.ts`
-   Utilities: `camelCase.ts`
-   Server Actions: `action.ts`
-   Validation: `schema.ts`

## Variables

-   camelCase

## Components

-   PascalCase

## Constants

-   UPPER_SNAKE_CASE

------------------------------------------------------------------------

# 5. Component Standards

Each feature should contain:

-   Page
-   Server Action
-   Validation Schema
-   UI Components
-   Types

Create reusable components before creating feature-specific ones.

------------------------------------------------------------------------

# 6. Server Actions

-   Prefer Server Actions over Route Handlers.
-   Validate input with Zod.
-   Return typed responses.
-   Never expose Prisma directly to the client.

------------------------------------------------------------------------

# 7. Database

-   Use Prisma for all database access.
-   Never write raw SQL unless necessary.
-   Always use transactions for multi-step operations.
-   Never duplicate data already represented by relationships.

------------------------------------------------------------------------

# 8. Forms

Every form must include:

-   Validation
-   Loading state
-   Success state
-   Error state
-   Disabled submit while processing

------------------------------------------------------------------------

# 9. Tables

Every data table must support:

-   Pagination
-   Search
-   Sorting
-   Filtering
-   Responsive layout
-   Empty state
-   Loading skeleton
-   Row actions

------------------------------------------------------------------------

# 10. Error Handling

Use consistent messages.

Handle:

-   Validation errors
-   Authentication errors
-   Authorization errors
-   Network failures
-   Empty states
-   Unknown errors

Never expose internal stack traces.

------------------------------------------------------------------------

# 11. Security

-   Validate all user input.
-   Protect all mutations.
-   Use Clerk roles for authorization.
-   Store secrets only in environment variables.
-   Sanitize uploaded file names.

------------------------------------------------------------------------

# 12. Performance

-   Prefer Server Components.
-   Lazy-load heavy client components.
-   Optimize Prisma queries.
-   Paginate large datasets.
-   Optimize images with Next.js Image.

------------------------------------------------------------------------

# 13. Accessibility

-   Semantic HTML
-   Keyboard navigation
-   Proper labels
-   Focus management
-   Sufficient color contrast

------------------------------------------------------------------------

# 14. Git Standards

Branch naming:

``` text
feature/student-module
feature/attendance
fix/dashboard
```

Commit examples:

``` text
feat(student): add student CRUD

feat(attendance): implement attendance marking

fix(timetable): resolve schedule conflict validation
```

------------------------------------------------------------------------

# 15. Definition of Done

A task is complete only if:

-   Feature matches Stitch design
-   Validation is implemented
-   Authorization is enforced
-   Database integration works
-   Responsive on desktop, tablet, and mobile
-   No TypeScript errors
-   No ESLint errors
-   Production build succeeds

------------------------------------------------------------------------

# 16. AI Generation Rules

Before generating code:

1.  Read all attached documentation.
2.  Do not invent APIs or database fields.
3.  Reuse existing components.
4.  Keep code modular.
5.  Do not modify unrelated modules.
6.  Keep the project buildable after every task.

------------------------------------------------------------------------

# Final Rule

Quality is more important than speed.

Generate production-quality code that is maintainable, strongly typed,
and consistent with the project architecture.
