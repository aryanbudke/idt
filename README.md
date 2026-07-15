## 🏗️ System Architecture

```mermaid
flowchart TD

U[👨‍🎓 Student]
F[👨‍🏫 Faculty]
A[👨‍💼 Admin]

U --> APP
F --> APP
A --> APP

APP[Next.js 15 Application]

APP --> AUTH[Clerk Authentication]
APP --> ACTIONS[Server Actions / API Routes]
ACTIONS --> SERVICES[Business Logic]
SERVICES --> PRISMA[Prisma ORM]
PRISMA --> DB[(PostgreSQL - Supabase)]
SERVICES --> STORAGE[Supabase Storage]
STORAGE --> IMAGES[Profile Images]
SERVICES --> ANALYTICS[Dashboard Analytics]
ANALYTICS --> APP
```


## 📁 Folder Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── admin/
│   ├── faculty/
│   ├── student/
│   └── api/
├── components/
├── actions/
├── services/
├── lib/
├── prisma/
├── hooks/
├── types/
├── validations/
└── middleware.ts
```


## 🔄 Request Lifecycle

```mermaid
sequenceDiagram

participant User
participant NextJS
participant ServerAction
participant Service
participant Prisma
participant PostgreSQL

User->>NextJS: Submit Request
NextJS->>ServerAction: Validate Input
ServerAction->>Service: Execute Business Logic
Service->>Prisma: Database Query
Prisma->>PostgreSQL: Read/Write Data
PostgreSQL-->>Prisma: Response
Prisma-->>Service: Data
Service-->>ServerAction: Processed Result
ServerAction-->>NextJS: Return Response
NextJS-->>User: Update UI
```


## 🗄️ Database Schema

```mermaid
erDiagram

USERS ||--o{ STUDENTS : manages
USERS ||--o{ FACULTY : manages

DEPARTMENTS ||--o{ STUDENTS : contains
DEPARTMENTS ||--o{ FACULTY : contains
DEPARTMENTS ||--o{ COURSES : offers

FACULTY ||--o{ COURSES : teaches

STUDENTS ||--o{ ATTENDANCE : has
STUDENTS ||--o{ MARKS : receives
STUDENTS ||--o{ FEES : pays

COURSES ||--o{ ATTENDANCE : records
COURSES ||--o{ MARKS : evaluates

ASSIGNMENTS ||--o{ ASSIGNMENT_SUBMISSIONS : receives
```


## 🔐 Authentication Flow

```mermaid
flowchart LR

User --> Clerk
Clerk --> JWT
JWT --> Middleware
Middleware --> RoleCheck
RoleCheck --> Admin
RoleCheck --> Faculty
RoleCheck --> Student
```


## 🚀 Deployment

```mermaid
flowchart LR

Developer --> GitHub
GitHub --> Vercel
Vercel --> NextJS
NextJS --> Clerk
NextJS --> Prisma
Prisma --> PostgreSQL
NextJS --> SupabaseStorage
```


## 🛠 Tech Stack

```text
Frontend
├── Next.js 15
├── TypeScript
├── Tailwind CSS
├── shadcn/ui
├── TanStack Table
└── Recharts

Backend
├── Next.js Server Actions
├── API Route Handlers
└── Prisma ORM

Authentication
└── Clerk

Database
└── PostgreSQL (Supabase)

Storage
└── Supabase Storage

Deployment
└── Vercel
```


