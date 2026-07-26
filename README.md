# GuardOps: Workforce Safety & PPE Monitoring Platform

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
