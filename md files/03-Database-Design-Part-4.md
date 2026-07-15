# 03-Database-Design.md

# Part 4 --- Academic Operations & Campus Resources

This section defines examinations, assessments, assignments,
announcements, events, and classroom management.

------------------------------------------------------------------------

# 15. Exam

## Purpose

Stores examination schedules for every subject.

## Fields

  Field                  Type       Notes
  ---------------------- ---------- -----------------------------------------
  id                     UUID       Primary Key
  teachingAssignmentId   FK         TeachingAssignment
  examType               Enum       IA1, IA2, Assignment, Lab, Semester End
  title                  String     Exam title
  examDate               Date       
  startTime              Time       
  endTime                Time       
  totalMarks             Integer    
  classroomId            FK         Optional
  status                 Enum       Scheduled, Ongoing, Completed
  createdAt              DateTime   
  updatedAt              DateTime   

### Business Rules

-   Every exam belongs to one Teaching Assignment.
-   Classroom conflicts must be prevented.

------------------------------------------------------------------------

# 16. Student Assessment

## Purpose

Stores marks and grade calculations for each student.

## Fields

  Field           Type
  --------------- ----------
  id              UUID
  examId          FK
  studentId       FK
  marksObtained   Decimal
  percentage      Decimal
  letterGrade     String
  gradePoints     Decimal
  remarks         String
  createdAt       DateTime
  updatedAt       DateTime

### Calculated Values

The ERP computes:

``` text
Marks
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

### Business Rules

-   One assessment per student per exam.
-   SGPA and CGPA are calculated, not manually entered.

------------------------------------------------------------------------

# 17. Assignment

## Purpose

Stores assignment information published by faculty.

## Fields

  Field                  Type
  ---------------------- ----------
  id                     UUID
  teachingAssignmentId   FK
  title                  String
  description            Text
  uploadDate             Date
  deadline               Date
  status                 Enum
  createdAt              DateTime
  updatedAt              DateTime

### Business Rules

-   Students submit assignments **offline**.
-   No file upload is required in Version 1.
-   Students can only view assignment details and deadlines.

------------------------------------------------------------------------

# 18. Announcement

## Purpose

Displays notices to users.

## Fields

  Field            Type
  ---------------- -------------------------------------
  id               UUID
  organizationId   FK
  title            String
  description      Text
  audience         Enum (ALL, STUDENT, FACULTY, ADMIN)
  publishDate      Date
  expiryDate       Date
  createdBy        FK (User)
  status           Enum
  createdAt        DateTime
  updatedAt        DateTime

------------------------------------------------------------------------

# 19. Event

## Purpose

Stores college events.

## Fields

  Field            Type
  ---------------- ----------
  id               UUID
  organizationId   FK
  title            String
  description      Text
  category         String
  venue            String
  eventDate        Date
  startTime        Time
  endTime          Time
  organizer        String
  status           Enum
  createdAt        DateTime
  updatedAt        DateTime

------------------------------------------------------------------------

# 20. Classroom

## Purpose

Stores classrooms and laboratories used for timetables and exams.

## Fields

  Field       Type
  ----------- -----------------------
  id          UUID
  campusId    FK
  roomCode    String
  building    String
  floor       Integer
  capacity    Integer
  roomType    Enum (CLASSROOM, LAB)
  status      Enum
  createdAt   DateTime
  updatedAt   DateTime

### Business Rules

-   Room codes must be unique within a campus.
-   A classroom cannot be assigned to two classes at the same time.

------------------------------------------------------------------------

# Relationship Flow

``` text
TeachingAssignment
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
Exam Assignment Timetable
 │
 ▼
Student Assessment
 │
 ▼
SGPA / CGPA

Organization
    │
    ├── Announcement
    └── Event

Campus
    │
    └── Classroom
```

------------------------------------------------------------------------

# Validation Rules

-   Exam dates cannot overlap for the same section.
-   Assignment deadlines must be after upload dates.
-   Event end time must be after start time.
-   Marks cannot exceed total marks.
-   Classroom capacity must be greater than zero.

------------------------------------------------------------------------

# Future Enhancements

-   Online assignment submission
-   Event registration
-   Certificates
-   Notification integration
-   AI performance analysis
-   Attendance prediction

------------------------------------------------------------------------

## Next (Part 5)

Part 5 will include:

-   Complete Entity Relationship Diagram (ERD)
-   Primary & Foreign Key Matrix
-   Relationship Mapping
-   Index Strategy
-   Database Constraints
-   Performance Optimization
