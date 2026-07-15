# 03-Database-Design.md

# Part 3 --- Academic Core Tables

This section defines the core entities responsible for users, teaching,
attendance, and scheduling.

------------------------------------------------------------------------

# 9. Student

## Purpose

Stores academic and personal information for every student.

## Fields

  Field              Type       Notes
  ------------------ ---------- ------------------------------
  id                 UUID       Primary Key
  userId             FK         References User
  studentId          String     Manual unique student ID
  firstName          String     
  lastName           String     
  email              String     
  phone              String     
  profileImageUrl    String     Supabase Storage URL
  gender             Enum       
  dateOfBirth        Date       
  emergencyContact   String     
  batch              Integer    Example: 2026
  departmentId       FK         
  programId          FK         
  semesterId         FK         
  sectionId          FK         
  status             Enum       ACTIVE, GRADUATED, SUSPENDED
  createdAt          DateTime   
  updatedAt          DateTime   

### Business Rules

-   Student ID must be unique.
-   A student belongs to one Department.
-   A student belongs to one Program.
-   A student belongs to one Semester.
-   A student belongs to one Section.

### UI Dependencies

-   Student Dashboard
-   Student Profile
-   Student Management
-   Reports
-   Global Search

------------------------------------------------------------------------

# 10. Faculty

## Purpose

Stores faculty information.

## Fields

  Field             Type
  ----------------- ----------
  id                UUID
  userId            FK
  facultyId         String
  firstName         String
  lastName          String
  email             String
  phone             String
  profileImageUrl   String
  designation       String
  joiningDate       Date
  departmentId      FK
  status            Enum
  createdAt         DateTime
  updatedAt         DateTime

### Business Rules

-   Faculty ID is manually assigned.
-   Faculty belongs to exactly one Department.

### UI Dependencies

-   Faculty Dashboard
-   Faculty Profile
-   Faculty Management
-   Global Search

------------------------------------------------------------------------

# 11. Admin

## Purpose

Represents ERP administrators.

## Fields

  Field             Type
  ----------------- ----------
  id                UUID
  userId            FK
  employeeCode      String
  firstName         String
  lastName          String
  email             String
  phone             String
  profileImageUrl   String
  createdAt         DateTime
  updatedAt         DateTime

------------------------------------------------------------------------

# 12. TeachingAssignment

## Purpose

Connects Faculty, Subject, Semester and Section.

## Fields

  Field          Type
  -------------- ----------
  id             UUID
  facultyId      FK
  subjectId      FK
  semesterId     FK
  sectionId      FK
  academicYear   String
  createdAt      DateTime
  updatedAt      DateTime

### Business Rules

-   One record represents one faculty teaching one subject to one
    section in one semester.
-   Attendance, Timetable, Assignments and Exams reference this table.

------------------------------------------------------------------------

# 13. Attendance

## Purpose

Stores daily attendance.

## Fields

  Field                  Type
  ---------------------- ------------------------
  id                     UUID
  teachingAssignmentId   FK
  studentId              FK
  attendanceDate         Date
  status                 Enum (PRESENT, ABSENT)
  remarks                String
  createdAt              DateTime
  updatedAt              DateTime

### Business Rules

-   One attendance record per student, subject and date.
-   Duplicate attendance for the same day is not allowed.

### Reports

-   Daily Attendance
-   Subject Attendance
-   Student Attendance %
-   Semester Attendance

------------------------------------------------------------------------

# 14. Timetable

## Purpose

Stores class schedules.

## Fields

  Field                  Type
  ---------------------- ----------
  id                     UUID
  teachingAssignmentId   FK
  classroomId            FK
  dayOfWeek              Enum
  startTime              Time
  endTime                Time
  createdAt              DateTime
  updatedAt              DateTime

### Business Rules

-   Faculty cannot have overlapping classes.
-   A classroom cannot be double-booked.
-   A section cannot have overlapping lectures.

------------------------------------------------------------------------

# Relationship Flow

``` text
User
│
├── Student
├── Faculty
└── Admin

Faculty
      │
      ▼
TeachingAssignment
      │
 ┌────┴─────┐
 ▼          ▼
Attendance Timetable
      │
      ▼
Student
```

------------------------------------------------------------------------

# Index Recommendations

-   studentId
-   facultyId
-   userId
-   teachingAssignmentId
-   attendanceDate
-   sectionId
-   semesterId

------------------------------------------------------------------------

## Next (Part 4)

Part 4 will define:

-   Exam
-   Student Assessment (Marks)
-   Assignment
-   Event
-   Announcement (Notice)
-   Classroom
