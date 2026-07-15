# 04-API-Design.md

# API Design Specification

Version: 1.0

This document defines the REST API contract for the College ERP system.
All endpoints require Clerk authentication unless otherwise noted.

------------------------------------------------------------------------

# API Standards

## Base URL

``` text
/api/v1
```

## Response Format

### Success

``` json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Error

``` json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

------------------------------------------------------------------------

# Authentication

Authentication Provider: Clerk

Authorization Header

``` text
Bearer <JWT>
```

Roles

-   ADMIN
-   FACULTY
-   STUDENT

------------------------------------------------------------------------

# 1. Authentication APIs

  Method   Endpoint   Access
  -------- ---------- --------
  GET      /auth/me   All

Returns the authenticated user's profile and role.

------------------------------------------------------------------------

# 2. Student APIs

  Method   Endpoint        Access
  -------- --------------- -------------------------------
  GET      /students       ADMIN
  POST     /students       ADMIN
  GET      /students/:id   ADMIN, FACULTY, STUDENT(Self)
  PATCH    /students/:id   ADMIN
  DELETE   /students/:id   ADMIN

Filters

-   Department
-   Program
-   Semester
-   Section
-   Batch
-   Status

Search

-   Student ID
-   Name
-   Email

------------------------------------------------------------------------

# 3. Faculty APIs

  Method   Endpoint       Access
  -------- -------------- ----------------------
  GET      /faculty       ADMIN
  POST     /faculty       ADMIN
  GET      /faculty/:id   ADMIN, FACULTY(Self)
  PATCH    /faculty/:id   ADMIN
  DELETE   /faculty/:id   ADMIN

------------------------------------------------------------------------

# 4. Department APIs

GET /departments

POST /departments

PATCH /departments/:id

DELETE /departments/:id

Access: ADMIN

------------------------------------------------------------------------

# 5. Academic Program APIs

GET /programs

POST /programs

PATCH /programs/:id

DELETE /programs/:id

Access: ADMIN

------------------------------------------------------------------------

# 6. Semester APIs

GET /semesters

POST /semesters

PATCH /semesters/:id

DELETE /semesters/:id

------------------------------------------------------------------------

# 7. Section APIs

GET /sections

POST /sections

PATCH /sections/:id

DELETE /sections/:id

------------------------------------------------------------------------

# 8. Subject APIs

GET /subjects

POST /subjects

PATCH /subjects/:id

DELETE /subjects/:id

------------------------------------------------------------------------

# 9. Teaching Assignment APIs

GET /teaching-assignments

POST /teaching-assignments

PATCH /teaching-assignments/:id

DELETE /teaching-assignments/:id

Access: ADMIN

------------------------------------------------------------------------

# 10. Attendance APIs

  Method   Endpoint                         Access
  -------- -------------------------------- -------------------------------
  GET      /attendance                      ADMIN, FACULTY
  POST     /attendance                      FACULTY
  PATCH    /attendance/:id                  FACULTY
  GET      /attendance/student/:studentId   ADMIN, FACULTY, STUDENT(Self)

------------------------------------------------------------------------

# 11. Timetable APIs

GET /timetables

POST /timetables

PATCH /timetables/:id

DELETE /timetables/:id

Students can only view their own timetable.

------------------------------------------------------------------------

# 12. Exam APIs

GET /exams

POST /exams

PATCH /exams/:id

DELETE /exams/:id

------------------------------------------------------------------------

# 13. Assessment APIs

GET /assessments

POST /assessments

PATCH /assessments/:id

Students can view only their own assessments.

------------------------------------------------------------------------

# 14. Assignment APIs

GET /assignments

POST /assignments

PATCH /assignments/:id

DELETE /assignments/:id

Students can only view assignments.

Offline submission only in Version 1.

------------------------------------------------------------------------

# 15. Event APIs

GET /events

POST /events

PATCH /events/:id

DELETE /events/:id

------------------------------------------------------------------------

# 16. Announcement APIs

GET /announcements

POST /announcements

PATCH /announcements/:id

DELETE /announcements/:id

------------------------------------------------------------------------

# 17. Dashboard APIs

## Admin Dashboard

GET /dashboard/admin

Returns

-   Student Count
-   Faculty Count
-   Department Count
-   Attendance Statistics
-   Upcoming Events
-   Recent Announcements

## Faculty Dashboard

GET /dashboard/faculty

Returns

-   Assigned Subjects
-   Today's Classes
-   Pending Attendance
-   Recent Assignments

## Student Dashboard

GET /dashboard/student

Returns

-   Attendance Percentage
-   SGPA
-   CGPA
-   Timetable
-   Assignments
-   Upcoming Exams
-   Events
-   Announcements

------------------------------------------------------------------------

# 18. Search API

GET /search?q=

Searches

-   Students
-   Faculty
-   Departments
-   Programs
-   Subjects
-   Events
-   Announcements

------------------------------------------------------------------------

# Validation Rules

-   Validate all request bodies.
-   Role-based authorization on every endpoint.
-   Pagination for list APIs.
-   Filtering and sorting supported.
-   Consistent error responses.

------------------------------------------------------------------------

# API Versioning

``` text
/api/v1
```

Future versions

``` text
/api/v2
```

------------------------------------------------------------------------

# Next Document

05-Prisma-Database-Schema.md

This document will convert the approved database design into Prisma
models ready for implementation.
