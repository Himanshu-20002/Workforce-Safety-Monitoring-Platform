# GuardOps: Workforce Safety & PPE Monitoring Platform

**Live Production Link:** [workforce-safety-monitoring-platfor.vercel.app](https://workforce-safety-monitoring-platfor.vercel.app/)

GuardOps is a comprehensive safety telemetry registry and management application designed for high-risk industrial environments (such as oil refineries, manufacturing sites, and construction zones). It ingests real-time IoT/camera telemetry of worker safety breaches, coordinates supervisor response, and provides automated escalation protocols for unacknowledged safety violations.

---

## 1. System Architecture & Flow

GuardOps connects remote safety cameras, site supervisors, and administrators together so they can monitor and manage safety alerts in one place.

```mermaid
graph TD
    A[IoT / AI Safety Cameras] -->|POST /api/violations| B[GuardOps Webhook API]
    B -->|Insert Violation status: Pending| C[PostgreSQL Database]
    D[Admin Officer] -->|Review escalated alerts > 10m| E[Admin Dashboard]
    F[Safety Supervisor] -->|Confirm & Acknowledge| G[Supervisor Dashboard]
    E -->|Query DB| C
    G -->|Acknowledge/Update status| C
    H[Better Auth Middleware] -->|Authenticate & Router Guard| D
    H -->|Authenticate & Router Guard| F
```

### The Data Flow:
1. **Telemetry Ingestion:** AI-enabled cameras send `POST` requests to `/api/violations` detailing a worker's ID, the location (site), and the safety violation type (e.g., `no_helmet`, `no_vest`).
2. **Database Ingestion:** The webhook API registers the violation. If the site is new, it dynamically creates a new location record. The violation is marked as `Pending`.
3. **Supervisor Acknowledgment:** The incident immediately appears on the **Supervisor Dashboard** under the **Violations** tab. The supervisor can review the details and click **Acknowledge** (which opens a confirmation modal before writing the update).
4. **Escalation Rules:** If the supervisor does **not** click acknowledge within **10 minutes**, the system automatically flags the incident as escalated. These escalated incidents are immediately pulled onto the **Admin Alerts Dashboard**.

---

## 2. Core Features

### 🔐 1. Authenticator & RBAC (Role-Based Access Control)
*   Implemented secure authentication using **Better Auth** (JWT-equivalent session cookie-based mechanism).
*   **Role-based Route Protection:** Next.js middleware dynamically guards routes:
    *   **Admins** only have access to `/admin/*` routes (personnel management, escalated alerts registry, data insights).
    *   **Supervisors** only have access to `/supervisor/*` routes (violations management, CSV reporting, supervisor dashboard).
    *   Unauthorized attempts automatically redirect users based on their authenticated role.

### 🏢 2. Administrator Portal
*   **Administrative Dashboard:** Displays overall safety stats, active supervisor count, total registered workers, and high-level compliance charts.
*   **Supervisor Management:** Full CRUD interface for admins to hire/create new supervisor accounts.
*   **Escalated Alerts Registry:** Real-time query showing violations that have remained unacknowledged for longer than 10 minutes.
*   **Data Insights:** Rich visual charts (using Recharts) analyzing violation trends, severity distribution, and site-wise compliance rates.

### 👷 3. Supervisor Portal
*   **Supervisor Dashboard:** Displays active PPE violations, recent incidents, and a safety status feed.
*   **Violations Management:** Interactive list of PPE incidents where supervisors can review worker details and acknowledge violations.
*   **Reports & Exporting:** Supervisors can filter violations by site or status and export the clean audit logs to standard **CSV format** with a single click.

### 🚨 4. Alert Ingestion & Simulation
*   Contains a public API webhook at `/api/violations` for IoT camera integrations.
*   Includes validation checks to ensure worker IDs exist in the database before logging breaches.

---

## 3. Advantages of the System

*   **⚡ High Performance:** Next.js 16 App Router optimized compilation coupled with indexes on high-frequency query columns (`role`, `status`, `createdAt`) ensures near-instantaneous page transitions and database queries.
*   **🔒 Type Safety & Secure Auth:** Fully written in **TypeScript** using **Better Auth** with type-safe schema definitions through **Drizzle ORM**. This eliminates common database query bugs and type mismatches.
*   **💾 Robust Schema Design:** Structured relational schema mapping users to sites, alerts, and violations. Supports auto-creation of sites when new telemetry comes in.
*   **📈 Real-time Escalation Detection:** Automatically calculates elapsed time since the incident occurred, ensuring critical safety issues are escalated to admins if supervisors fail to respond promptly.

---

## 4. Setup & Execution Instructions

### Prerequisites
*   Node.js (v18.x or later recommended)
*   PostgreSQL database instance (e.g., Neon Postgres, local Postgres, or Supabase)

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/Himanshu-20002/Workforce-Safety-Monitoring-Platform.git
cd guard-ops
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the project (you can copy `.env.example` as a starting point) and supply your database connection string and Better Auth configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-better-auth-key-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
```

### 3. Push Database Schema
Use Drizzle to push the tables and indexes directly to your PostgreSQL database:
```bash
npx drizzle-kit push
```

### 4. Seed the Database
Import the worker profiles from the provided Excel dataset and create default accounts (Admin and Supervisor) using the seed scripts:
```bash
# Seed worker list from spreadsheet
npx tsx scripts/seed-workers.ts

# Create default demo accounts (Admin & Supervisor)
npx tsx scripts/seed-demo-users.ts
```
*   **Demo Admin Credentials:** `admin@guardops.com` / `password123`
*   **Demo Supervisor Credentials:** `supervisor@guardops.com` / `password123`

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to access the platform.

### 6. Simulating a Safety Violation (IoT Telemetry)
You can simulate a camera sending a safety violation by making a `POST` request to `/api/violations`:

**Example Request (cURL):**
```bash
curl -X POST http://localhost:3000/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "workerId": "worker-uuid-here",
    "site": "Construction Area Beta",
    "violationType": "no_helmet"
  }'
```
*(Ensure to replace `"worker-uuid-here"` with an actual worker's ID from the database/dashboard).*

---

## 5. Database Schema

GuardOps uses a strongly typed PostgreSQL relational schema designed using Drizzle ORM:

### 1. `user` Table
Stores account credentials, profile details, and role assignments:
*   `id` (text, Primary Key)
*   `name` (text, Non-Null)
*   `email` (text, Non-Null, Unique)
*   `emailVerified` (boolean)
*   `image` (text)
*   `role` (varchar, default: 'worker') — `'admin' | 'supervisor' | 'worker'`
*   `site` (text) — Assigned safety location zone
*   `status` (text, default: 'Active') — `'Active' | 'Pending' | 'Escalated'`
*   `jobProfile` (text)
*   `employeeId` (text) — Custom employee identification code (e.g., `WRK0001`)
*   *Indexes:* Optimized search index on the `role` column.

### 2. `violation` Table
Logs safety breaches captured from IoT telemetry:
*   `id` (text, Primary Key)
*   `type` (varchar) — e.g., `no_helmet`, `no_vest`
*   `description` (text) — telemetry log summary
*   `severity` (varchar, default: 'medium')
*   `status` (varchar, default: 'Pending') — `'Pending' | 'Acknowledged'`
*   `workerId` (text) — Foreign key references `user.id`
*   `locationId` (text) — Foreign key references `location.id`
*   `createdAt` & `updatedAt` (timestamp)
*   *Indexes:* High-frequency query indexes on `status`, `createdAt`, and relationships.

### 3. `location` Table
Tracks active sites/zones monitored by security systems:
*   `id` (text, Primary Key)
*   `name` (text, Unique) — Site name
*   `description` (text)
*   `riskLevel` (varchar)

### 4. Better Auth Required Tables (`session`, `account`, `verification`)
Auto-generated and managed by Better Auth to store secure browser session tokens and OAuth credentials.

---

## 6. Project Documentation & File Structure

Here is a guide to the project workspace directory structure:

```
guard-ops/
├── app/                             # Next.js App Router Pages & API Routes
│   ├── (admin)/                     # Admin Route Group (Dashboard, Alerts, Workers, Supervisors)
│   ├── (auth)/                      # Authentication Pages (Sign In / Register)
│   ├── (supervisor)/                # Supervisor Route Group (Dashboard, Workers, Violations, Analytics, Reports)
│   ├── api/                         # Backend APIs (Authentication & Ingestion endpoints)
│   └── layout.tsx                   # Main layout wrapper
├── components/                      # UI Components
│   ├── auth/                        # Authentication form components (AuthForm)
│   ├── dashboard/                   # Metric cards, statistics widgets, and charts
│   ├── layout/                      # Shared layouts (sidebar navigation)
│   ├── ui/                          # Shared UI elements (Button, Input, Toast, AnimatedCounter)
│   └── workers/                     # Shared worker management table & actions
├── actions/                         # Next.js type-safe Server Actions
│   ├── alerts.ts                    # Handles escalated admin alerts queries
│   ├── dashboard.ts                 # Fetches administrative statistical summaries
│   └── violations.ts                # Acknowledges worker safety violations
├── lib/                             # Core utilities and settings
│   ├── db/                          # Database Client & Drizzle Schema configuration
│   └── auth.ts                      # Better Auth server configuration
└── scripts/                         # Seeding scripts (importing workers spreadsheet & demo users)
```

---

## 7. API Documentation

### 1. Ingest Safety Violation (IoT Telemetry Webhook)
Endpoint to log real-time worker safety infractions detected by cameras.
*   **URL:** `/api/violations`
*   **Method:** `POST`
*   **Auth Required:** No (Public endpoint for cameras)
*   **Request Body (JSON):**
    ```json
    {
      "workerId": "string (UUID representing the worker)",
      "site": "string (The name of the location where the violation occurred)",
      "violationType": "string (e.g., 'no_helmet', 'no_vest', 'no_harness')"
    }
    ```
*   **Responses:**
    *   **200 OK:** Violation registered successfully.
        ```json
        { "success": true, "violationId": "uuid", "message": "Violation recorded successfully." }
        ```
    *   **400 Bad Request:** Missing required fields.
    *   **404 Not Found:** Worker ID does not exist in database.

### 2. Create Demo User (Simulation Endpoint)
Helper API to programmatically provision testing accounts.
*   **URL:** `/api/test/create-demo-user`
*   **Method:** `POST`
*   **Request Body (JSON):**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword",
      "name": "User Name",
      "role": "admin | supervisor"
    }
    ```
*   **Response:**
    *   **200 OK:**
        ```json
        { "success": true, "user": { "id": "uuid", "email": "user@example.com", "name": "User Name" } }
        ```

### 3. Better Auth Core Endpoints
Handled automatically by the catch-all router (`/api/auth/*`):
*   `POST /api/auth/sign-in/email` — Authenticate credentials.
*   `POST /api/auth/sign-up/email` — Create user accounts (stores inputs like name, email, password, and role).
*   `POST /api/auth/sign-out` — Terminate user session.
*
