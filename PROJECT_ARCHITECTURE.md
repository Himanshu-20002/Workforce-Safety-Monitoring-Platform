# Project Architecture & Status Report

This document provides a detailed breakdown of the current folder structure, implemented modules, current stage of the codebase, and outstanding items left to implement.

---

## 1. Directory & Folder Structure

Here is the simplified layout of the active codebase:

```
workforce-safety-monitoring-platform/
├── app/                              # Next.js App Router (Restructured)
│   ├── (auth)/                       # Auth Route Group
│   │   └── sign-in/                  # Authentication sign-in page
│   ├── (admin)/                      # Admin Route Group
│   │   ├── alerts/                   # [Placeholder] Safety alerts list page
│   │   ├── analytics/                # [Placeholder] Analytics & charts
│   │   ├── dashboard/                # Main Admin Dashboard page (Mock Data)
│   │   ├── supervisors/              # [Placeholder] Supervisor management page
│   │   ├── workers/                  # [Placeholder] Workers management page
│   │   └── layout.tsx                # Shared Admin navigation layout
│   ├── (supervisor)/                 # Supervisor Route Group
│   │   ├── dashboard/                # Main Supervisor Dashboard page (Mock Data)
│   │   ├── reports/                  # [Placeholder] Safety reports generator
│   │   ├── violations/               # [Placeholder] PPE violations tracking page
│   │   └── layout.tsx                # Shared Supervisor navigation layout
│   ├── api/                          # Backend API Routes
│   │   └── auth/                     # Better Auth API endpoints
│   │       └── [...all]/
│   │           └── route.ts
│   ├── globals.css                   # Global CSS & Tailwind configuration
│   ├── layout.tsx                    # Root Layout
│   ├── page.tsx                      # Root Page (Redirects to dashboard or sign-in)
│   ├── robots.ts                     # Search engine crawler optimization
│   └── sitemap.ts                    # Dynamic sitemap generator
│
├── components/                       # Shared React Components
│   ├── auth-form.tsx                 # Better Auth Login / Signup Form
│   ├── charts/                       # Chart wrappers for analytics
│   ├── common/                       # Basic icons and generic layouts
│   ├── dashboard/                    # Dashboard specific cards & metric widgets
│   ├── forms/                        # Form elements & styling
│   ├── layout/                       # Header and Navigation bars
│   ├── tables/                       # Safety violation data tables
│   └── ui/                           # Primitive components (buttons, input, dialogue)
│
├── actions/                          # Server Actions
│   ├── auth.ts                       # Auth server actions (getCurrentUser, signOut, etc.)
│   ├── workers.ts                    # Workers server actions (getWorkers)
│   ├── supervisors.ts                # Supervisors server actions (getSupervisors)
│   ├── violations.ts                 # Violations server actions (getViolations)
│   ├── alerts.ts                     # Alerts server actions (getAlerts)
│   └── reports.ts                    # Reports server actions (getReports)
│
├── constants/                        # Fixed system values and configurations
├── hooks/                            # Custom React Hooks
│   ├── index.ts                      # Hook index exporter
│   └── use-session.ts                # Session bridge hook linking to Better Auth
│
├── lib/                              # Logic, database connection, and utility functions
│   ├── db/                           # Drizzle database configurations
│   │   ├── index.ts                  # Database client pool initialization
│   │   └── schema.ts                 # Full Drizzle PostgreSQL schema definitions
│   ├── auth-client.ts                # Better Auth browser/client initialization
│   ├── auth.ts                       # Better Auth server/core configuration
│   ├── csv.ts                        # Placeholder helper for exporting data
│   ├── escalation.ts                 # Placeholder helper for alert escalation levels
│   ├── jwt.ts                        # Placeholder helper for JWT tokens
│   ├── utils.ts                      # CSS styling classes merger utility (cn)
│   └── validations.ts                # Placeholder validation schemas (Zod)
│
├── scripts/                          # Administration / Utility scripts
│   └── seed-demo-users.ts            # Seeding script to create demo users in DB
│
├── .env                              # Current active environmental values (Neon DB url, etc.)
├── drizzle.config.ts                 # Drizzle Schema push and migration compiler config
├── package.json                      # Project dependencies & build instructions
└── tsconfig.json                     # Typescript configuration
```

---

## 2. Currently Implemented Modules & Features

### 🔑 Authentication & Role-Based Access Control (RBAC)
- **Better Auth Integration:** Configured with Email/Password flow. Automatically sets secure `httpOnly` session cookies and manages login, registration, and logout flows.
- **Drizzle Database Adapter:** Configured to save user records, session states, and credentials directly in the database.
- **Middleware Guarding:** Detects active sessions and redirects unauthorized requests to `/sign-in`. Routes users to their respective sub-dashboards based on roles (`admin` / `supervisor`).
- **Use-Session Hook Bridge:** Refactored React context so all existing dashboard components read user session states directly from Better Auth.

### 🗄️ Database & Schema Pushing (Neon PostgreSQL)
- **Drizzle Configuration:** `drizzle.config.ts` handles connections.
- **Schema Synced:** The database structure in `lib/db/schema.ts` includes full relations and is fully synchronized with Neon DB:
  - `user`: Custom role, email validation, names, images, timestamps.
  - `session` & `account`: Better Auth tracking tables.
  - `alert`: Safety alerts table tracking severities, categories, and resolution states.
  - `violation`: Safety breach table assigned to workers and supervisors.
  - `location`: Workplace site listings.
  - `report`: Safety compliance scores, violation counts, and JSON datasets.

### ⚡ Server Actions
- Built server-side controllers in `actions/` to safely interface components with Drizzle:
  - `actions/auth.ts`: Active session utilities.
  - `actions/workers.ts`: Fetching and filtering workers.
  - `actions/supervisors.ts`: Fetching and listing supervisors.
  - `actions/violations.ts`: Querying violations.
  - `actions/alerts.ts`: Retrieving alerts.
  - `actions/reports.ts`: Fetching report configurations.

### 🎨 Frontend Layouts (Tailwind CSS)
- **Dashboard Views:** Complete layouts with stats, grid lists, charts, and mobile responsiveness for Admin and Supervisor viewports.
- **Auth Forms:** Sleek, accessible Sign-up and Sign-in forms.

### 🌐 SEO & Crawler Optimizations
- **Native Next.js Sitemaps:** Generates XML indexes on-the-fly dynamically.
- **Robots.txt Control:** Directs crawlers and explicitly blocks crawling of backend API paths and private pages (`/(admin)/*`, `/(supervisor)/*`).

---

## 3. Current Project Stage: **Infrastructure Complete, Feature Placements Pending**

| Stage | Status | Description |
|---|---|---|
| **1. Database Setup** | **100% Done** | Neon PostgreSQL database connected and tables pushed. |
| **2. Auth System** | **100% Done** | Sign up, Log in, Sign out, and Route protection working. |
| **3. Project Cleanliness** | **100% Done** | Prisma removed, unused assets purged, config files minimized. |
| **4. Feature Business Logic** | **25% Done** | Dashboard pages are restructured into route groups and actions are ready. |
| **5. Sub-pages** | **0% Done** | Pages like alerts list, supervisor manager, and reports are placeholders. |

---

## 4. Outstanding Items (What is Left to Implement)

### 📊 Phase 1: Database Integration for Dashboards
- [ ] **Dynamic Metrics:** Replace mock statistics in `app/(admin)/dashboard/page.tsx` and `app/(supervisor)/dashboard/page.tsx` with actual SQL counts from the `alert` and `violation` tables.
- [ ] **Active Charts:** Populate the dashboard analytics graphs using actual historical records from the database.

### 📄 Phase 2: Build Placeholder Pages
- [ ] **Alerts List (`app/(admin)/alerts/page.tsx`):**
  - Fetch and display the list of alerts from the database.
  - Add filters for severity (Low, Medium, High, Critical) and Category (e.g., missing helmet, missing vest).
  - Add buttons to acknowledge or mark alerts resolved.
- [ ] **Supervisor Registry (`app/(admin)/supervisors/page.tsx`):**
  - Fetch users whose role is `'supervisor'` and render them in a table.
  - Build actions to change roles or add new supervisor credentials.
- [ ] **Violations Manager (`app/(supervisor)/violations/page.tsx`):**
  - List recorded safety violations.
  - Add features to assign violations to specific supervisors or log resolution notes.
- [ ] **Analytics & Compliance Reports (`app/(supervisor)/reports/page.tsx`):**
  - Query safety scores and export compliance tables to CSV.

### 📡 Phase 3: External Event Ingestion API
- [ ] **Camera Detection Ingestion (`app/api/violations/route.ts`):**
  - Create a POST endpoint that external AI cameras or safety scanners can send webhooks to.
  - Parse events (worker ID, site location, violation type) and automatically insert them as active alerts/violations.
