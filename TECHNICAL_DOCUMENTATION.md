# V-Excel Portal - Technical Documentation

**Version:** 1.0.0
**Date:** February 16, 2026
**Status:** Approved for Release

---

## 1. Executive Summary

The **V-Excel Student Portal** is a specialized, enterprise-grade web application designed to manage student data, clinical history, developmental milestones, and therapeutic reports for the V-Excel Foundation. The system facilitates secure collaboration between administrators, staff (therapists/teachers), and parents.

Key capabilities include:
-   **Student Management:** Comprehensive profiles including demographics, UDID tracking, and medical history.
-   **Role-Based Access Control (RBAC):** Distinct portals for Admins (full control), Staff (data entry/reports), and Parents (read-only access).
-   **Clinical Data Tracking:** Structured recording of clinical history, developmental milestones, daily living skills (ADL), and clinical observations.
-   **Automated Reporting:** on-demand PDF generation for student reports (Screening, Quarterly, IEP, etc.).
-   **Attendance Monitoring:** Automated percentage calculation based on daily attendance records.
-   **Emergency Access:** Publicly accessible, token-secured emergency profiles for students.

The system is built on a modern, serverless-compatible architecture using **Next.js** for the frontend and **Node.js/Express** for the backend, backed by a **PostgreSQL** database.

---

## 2. System Architecture

The application follows a **Decoupled Client-Server Architecture** deployed on cloud-native infrastructure.

### 2.1. High-Level Architecture Diagram
```mermaid
graph TD
    User[Users (Admin/Staff/Parent)] -->|HTTPS/TLS| CDN[Vercel Edge Network]
    CDN --> Frontend[Next.js Frontend]
    Frontend -->|REST API| Backend[Node.js/Express Backend]
    Backend -->|Prisma ORM| DB[(PostgreSQL Database)]
    Backend -->|Auth Middleware| Auth[JWT Authentication]
```

### 2.2. Component Architecture
1.  **Presentation Layer (Frontend):**
    -   Built with **Next.js 14**, utilizing Server Components and Client Components.
    -   Styled with **Tailwind CSS** for responsive design.
    -   State management via React Hooks.
    -   Visualizations using **Chart.js**.

2.  **Application Layer (Backend):**
    -   **Express.js** REST API running as a serverless function (on Vercel).
    -   **Prisma ORM** for type-safe database interactions.
    -   **Microservices/Modules:**
        -   `authController`: User authentication & RBAC.
        -   `studentController`: CRUD operations for student profiles.
        -   `documentController`: PDF generation (PDFKit) and handling.
        -   `dashboardController`: Analytics and event management.

3.  **Data Layer:**
    -   **PostgreSQL** (hosted on Neon) as the primary relational store.
    -   Stores structured data (users, students, milestones) and unstructured data (base64-encoded PDF files).

---

## 3. Technology Stack

### 3.1. Frontend
| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 14.1.0 | React framework for production. |
| **Language** | TypeScript | 5.x | Static typing. |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS framework. |
| **UI Components** | React Icons | 5.5.0 | Icon library. |
| **Animations** | Framer Motion | 12.29.0 | Animation library. |
| **Charts** | Chart.js / react-chartjs-2 | 4.4.1 | Data visualization. |
| **HTTP Client** | Native Fetch | N/A | Server Actions & Client-side fetching. |

### 3.2. Backend
| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | 20.x | JavaScript runtime. |
| **Framework** | Express.js | 5.2.1 | Web application framework. |
| **Language** | TypeScript | 5.x | Static typing. |
| **ORM** | Prisma | 6.19.2 | Type-safe database client. |
| **Database** | PostgreSQL | 15+ | Relational database system. |
| **PDF Engine** | PDFKit | 0.17.2 | Programmatic PDF generation. |
| **Authentication** | JSON Web Tokens (JWT) | 9.0.x | Stateless authentication. |
| **Password Hashing** | bcryptjs | 3.0.3 | Secure password hashing. |

### 3.3. Infrastructure
-   **Hosting (Frontend & Backend):** Vercel (Serverless Functions)
-   **Database Hosting:** Neon (Serverless PostgreSQL)
-   **Version Control:** Git / GitHub
-   **CI/CD:** Vercel Automated Deployments

---

## 4. Installation & Deployment

### 4.1. Prerequisites
-   Node.js v18.17.0 or higher.
-   npm or yarn package manager.
-   PostgreSQL database connection string.

### 4.2. Local Development Setup

**1. Clone the Repository:**
```bash
git clone <repository-url>
cd vexcel-portal
```

**2. Database Setup:**
-   Ensure PostgreSQL is running.
-   Navigate to the backend directory: `cd backend`
-   Create a `.env` file based on `.env.example`:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/vexcel_db"
    JWT_SECRET="your_development_secret_key"
    ```
-   Run migrations:
    ```bash
    npx prisma generate
    npx prisma db push
    ```
-   Seed the database (creates default admin/student):
    ```bash
    npm run seed
    ```

**3. Backend Setup:**
```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:5000
```

**4. Frontend Setup:**
Open a new terminal in the root directory:
```bash
npm install
# Configure .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
# Frontend starts at http://localhost:3000
```

### 4.3. Production Deployment (Vercel)

The project is configured for seamless deployment on Vercel.

**1. Backend Deployment:**
-   Import the `backend` directory as a new project in Vercel.
-   Set Environment Variables:
    -   `DATABASE_URL`: Connection string to Neon PostgreSQL.
    -   `JWT_SECRET`: Strong random string.
    -   `CORS_ORIGIN`: URL of the frontend application.
-   Build Command: `prisma generate && tsc`
-   Output Directory: `dist`
-   Install Command: `npm install`

**2. Frontend Deployment:**
-   Import the root directory as a new project in Vercel.
-   Set Environment Variables:
    -   `NEXT_PUBLIC_API_URL`: The URL of the deployed backend (e.g., `https://backend-xyz.vercel.app/api`).
-   Build Command: `next build`
-   Install Command: `npm install`

---

## 5. Configuration

### 5.1. Environment Variables

**Backend (`backend/.env`):**
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL Connection String | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Yes | Key for signing JWTs | `super_secret_key_123` |
| `PORT` | No | Server port (Local only) | `5000` |
| `CORS_ORIGIN` | No | Allowed frontend origin | `https://vexcel-portal.vercel.app` |

**Frontend (`.env.local` / Vercel Env):**
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API Endpoint | `https://backend-app.vercel.app/api` |

---

## 6. API Documentation

### 6.1. Authentication
All protected endpoints require a Bearer Token in the header.
**Header Format:** `Authorization: Bearer <token>`

### 6.2. Endpoints Overview

#### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/login` | Authenticate user & get token | Public |
| POST | `/register` | Register new user | Admin |
| GET | `/users` | List all users | Admin |
| PUT | `/users/:id` | Update user details | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

#### Student Routes (`/api/students`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | List all students | Staff/Admin |
| POST | `/` | Create new student | Admin |
| GET | `/:id` | Get student profile | Staff/Admin/Parent (Linked) |
| PATCH | `/:id` | Update student profile | Staff/Admin |
| DELETE | `/:id` | Delete student | Admin |

#### Dashboard Routes (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/stats` | Get center statistics | Staff/Admin |
| GET | `/events` | Get upcoming events | All Authenticated |
| POST | `/events` | Create event | Admin |

#### Document Routes (`/api/documents`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/upload` | Upload PDF report | Staff/Admin |
| POST | `/generate` | Generate PDF report | Staff/Admin |
| GET | `/student/:id` | List student documents | Staff/Admin/Parent (Linked) |
| GET | `/download/:id` | Download specific file | Authenticated |

### 6.3. Error Handling
The API returns errors in the following JSON format:
```json
{
  "message": "Error description here"
}
```
**Common Status Codes:**
-   `200/201`: Success
-   `400`: Bad Request (Validation failed)
-   `401`: Unauthorized (Missing/Invalid token)
-   `403`: Forbidden (Insufficient role)
-   `404`: Resource Not Found
-   `500`: Internal Server Error

---

## 7. Database Schema

The database is built on **PostgreSQL** and managed via **Prisma ORM**.

### 7.1. ER Diagram
```mermaid
erDiagram
    User ||--o{ Document : uploads
    User ||--o{ RecordVersion : creates
    Student ||--o{ Document : has
    Student ||--|| ClinicalHistory : has
    Student ||--|| DevelopmentalMilestones : has
    Student ||--|| DailyLivingSkills : has
    Student ||--|| ClinicalObservations : has

    User {
        int id PK
        string email
        string role
    }
    Student {
        int id PK
        string udid UK
        string ipp_number UK
    }
    Document {
        int id PK
        string filename
        string status
    }
    RecordVersion {
        int id PK
        string entity_type
        int version_number
    }
```


### 7.3. Indexing Strategy
-   **Primary Keys:** Auto-incrementing Integers (`id`) for all tables.
-   **Unique Indexes:**
    -   `User.email`
    -   `Student.udid`
    -   `Student.ipp_number`
    -   `Student.public_link_token`

---

## 8. Security Audit

### 8.1. Authentication & Authorization
-   **Mechanism:** JSON Web Tokens (JWT).
-   **Roles:**
    -   `admin`: Full access to all endpoints.
    -   `staff`: Read/Write access to students/reports; no user management.
    -   `parent`: Read-only access to specific linked student profile.
-   **Middleware:** `authenticate` verifies token, `authorize` checks role permissions.

### 8.2. Data Protection
-   **Passwords:** Hashed using `bcryptjs` (salt rounds: 10).
-   **Transit:** All traffic secured via HTTPS (TLS 1.2/1.3) on Vercel.
-   **At Rest:** Database encryption provided by Neon/AWS infrastructure.

### 8.3. Audit Logging
-   **Clinical Data:** The `RecordVersion` table tracks *who* changed *what* and *when* for critical clinical data, ensuring accountability.

---

## 9. Testing & Quality Assurance

### 9.1. Testing Strategy
-   **Code analysis:** ESLint configured for static analysis.
-   **Type Checking:** Strict TypeScript configuration.
-   **<<PROJECT_SPECIFIC_DETAILS_REQUIRED>>:** Unit and Integration tests are currently not configured in the provided codebase. Recommended stack: **Jest** for backend, **React Testing Library** for frontend.

---

## 10. Maintenance & Operations

### 10.1. Backup & Recovery
-   **Database:** Neon provides point-in-time recovery (PITR) and automated daily backups.
-   **Application Code:** Maintained in GitHub with full history.

### 10.2. Component Updates
-   **Frontend:** Update via `npm update` in root directory.
-   **Backend:** Update via `npm update` in `backend` directory.
-   **Database Schema:**
    1.  Modify `prisma/schema.prisma`.
    2.  Run `npx prisma migrate dev` (Local).
    3.  Run `npx prisma db push` (Production - if using serverless mode).

### 10.3. Logging
-   **Application Logs:** Vercel Runtime Logs (accessible via Vercel Dashboard).
-   **Access Logs:** Database query logs available in Neon Console.

### 10.4. Disaster Recovery
-   **RTO (Recovery Time Objective):** < 1 hour (Vercel Rollback + DB Restore).
-   **RPO (Recovery Point Objective):** < 24 hours (Daily DB Backups).

---

## 11. Troubleshooting Guide

### 11.1. Common Issues
| Issue | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **Database Connection Failure** | Incorrect `DATABASE_URL` or IP whitelist. | Verify connection string in Vercel Env. Check if Neon project is active. |
| **CORS Errors** | Mismatched origin. | Ensure `CORS_ORIGIN` in backend matches frontend domain exactly. |
| **PDF Generation Timeout** | Large images/content or Vercel timeout. | Optimize images; increase Serverless Function timeout in `vercel.json`. |
| **Login "Unauthorized"** | Expired/Invalid Token. | Clear browser storage (`localStorage` / cookies) and re-login. |

### 11.2. Debugging Steps
1.  **Check Browser Console:** Look for Red errors in Network tab (4xx/5xx).
2.  **Vercel Runtime Logs:**
    -   Go to Vercel Dashboard > Deployments > Logs.
    -   Filter by `ERROR` to see stack traces.
3.  **Local Debugging:**
    -   Run `npm run dev` in both frontend/backend.
    -   Use `console.log` (backend logs to terminal, frontend to browser).

---

