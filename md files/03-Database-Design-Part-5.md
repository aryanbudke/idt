# 03-Database-Design.md

# Part 5 --- Relationships, Constraints & Performance

This section documents how all entities are connected and defines
database optimization strategies.

------------------------------------------------------------------------

# 1. High-Level Entity Relationship Diagram

``` text
Organization
│
├── Campus
│     │
│     ├── Department
│     │      │
│     │      ├── AcademicProgram
│     │      │        │
│     │      │        ├── Semester
│     │      │        │      │
│     │      │        │      ├── Section
│     │      │        │      │      │
│     │      │        │      │      ├── Student
│     │      │        │      │
│     │      │        │      └── Subject
│     │      │        │
│     │      │        └── Faculty
│     │      │
│     │      └── Classroom
│     │
│     ├── Announcement
│     └── Event
│
└── User
      ├── Student
      ├── Faculty
      └── Admin

Faculty
     │
     ▼
TeachingAssignment
     │
 ┌───┼──────────────┬──────────────┐
 ▼   ▼              ▼              ▼
Exam Attendance Assignment Timetable
 │
 ▼
StudentAssessment
 │
 ▼
SGPA / CGPA
```

------------------------------------------------------------------------

# 2. Relationship Matrix

  Parent               Child                Relationship
  -------------------- -------------------- --------------
  Organization         Campus               One-to-Many
  Campus               Department           One-to-Many
  Department           Academic Program     One-to-Many
  Academic Program     Semester             One-to-Many
  Semester             Section              One-to-Many
  Semester             Subject              One-to-Many
  User                 Student              One-to-One
  User                 Faculty              One-to-One
  User                 Admin                One-to-One
  Faculty              TeachingAssignment   One-to-Many
  Subject              TeachingAssignment   One-to-Many
  Section              Student              One-to-Many
  TeachingAssignment   Attendance           One-to-Many
  TeachingAssignment   Assignment           One-to-Many
  TeachingAssignment   Timetable            One-to-Many
  TeachingAssignment   Exam                 One-to-Many
  Exam                 StudentAssessment    One-to-Many
  Classroom            Timetable            One-to-Many
  Classroom            Exam                 One-to-Many

------------------------------------------------------------------------

# 3. Primary Key Strategy

All tables use UUIDs.

  Table                Primary Key
  -------------------- -------------
  Organization         id
  Campus               id
  Department           id
  AcademicProgram      id
  Semester             id
  Section              id
  Subject              id
  User                 id
  Student              id
  Faculty              id
  Admin                id
  TeachingAssignment   id
  Attendance           id
  Timetable            id
  Exam                 id
  StudentAssessment    id
  Assignment           id
  Announcement         id
  Event                id
  Classroom            id

------------------------------------------------------------------------

# 4. Foreign Key Strategy

Examples:

  Table                Foreign Keys
  -------------------- --------------------------------------------------------
  Campus               organizationId
  Department           campusId
  AcademicProgram      departmentId
  Semester             programId
  Section              semesterId
  Subject              semesterId
  Student              userId, departmentId, programId, semesterId, sectionId
  Faculty              userId, departmentId
  TeachingAssignment   facultyId, subjectId, semesterId, sectionId
  Attendance           teachingAssignmentId, studentId
  Exam                 teachingAssignmentId, classroomId
  StudentAssessment    examId, studentId
  Timetable            teachingAssignmentId, classroomId

------------------------------------------------------------------------

# 5. Index Strategy

Indexes improve search and reporting performance.

## Unique Indexes

-   organization.code
-   department.code
-   program.code
-   subject.code
-   student.studentId
-   faculty.facultyId
-   user.email
-   user.clerkUserId

## Foreign Key Indexes

-   organizationId
-   campusId
-   departmentId
-   programId
-   semesterId
-   sectionId
-   facultyId
-   studentId
-   subjectId
-   teachingAssignmentId
-   classroomId

## Search Indexes

-   Student Name
-   Faculty Name
-   Program Name
-   Department Name
-   Subject Name
-   Event Title
-   Announcement Title

------------------------------------------------------------------------

# 6. Constraints

## Student

-   Student ID must be unique.
-   Email must be unique.
-   Batch cannot be null.

## Faculty

-   Faculty ID must be unique.
-   Faculty belongs to one Department.

## Subject

-   Subject code must be unique within a Program.

## Attendance

-   Only one attendance record per student, subject, and date.

## Timetable

-   No overlapping faculty schedules.
-   No overlapping classroom schedules.
-   No overlapping section schedules.

## Exam

-   Exam date cannot overlap for the same section.

## Student Assessment

-   Marks cannot exceed total marks.
-   One assessment per student per exam.

------------------------------------------------------------------------

# 7. Performance Optimization

-   UUID primary keys
-   Indexed foreign keys
-   Optimized joins through normalized design
-   Soft delete strategy
-   Store images in Supabase Storage
-   Avoid duplicate data
-   Paginated APIs
-   Search indexes for global search

------------------------------------------------------------------------

# 8. Multi-Tenant Strategy

Every business entity ultimately belongs to an Organization.

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
Academic Data
```

This enables:

-   Multiple colleges
-   Multiple campuses
-   Separate data isolation
-   Future SaaS deployment

------------------------------------------------------------------------

# 9. Future Scalability

The schema supports adding:

-   Fee Management
-   Library
-   Hostel
-   Transport
-   Placement
-   AI Insights
-   Notifications
-   Online Assignment Submission
-   Certificates

without major redesign.

------------------------------------------------------------------------

# Next (Part 6)

Part 6 will include:

-   Prisma Model Mapping
-   Naming Standards
-   Migration Strategy
-   Folder Structure
-   Database Versioning
-   Final Architecture Summary
