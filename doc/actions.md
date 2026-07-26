# Next.js Server Actions Guide

This document describes the role of the `actions/` folder in the GuardOps codebase and explains what each server action module does.

## What is the `actions/` Folder?

The files in the `actions/` directory are Next.js **Server Actions**. They are marked with the `'use server';` directive at the top. 

### Why Use Server Actions?
* **Zero API Boilerplate:** Instead of writing REST API endpoint routers (`/api/route`) and fetching them with `fetch()`, components call these server actions directly as regular asynchronous JavaScript functions.
* **Exclusively Server-Side:** These functions run securely on the node.js server. They have direct access to our database instance (`db`), environment secrets, and sensitive backend models without exposing them to the client browser.
* **Form Actions & Progressive Enhancement:** They integrate with React's `<form action={...}>` to handle form submissions cleanly.

---

## File Registry & Purposes

### 1. [alerts.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/alerts.ts)
* **Purpose:** Handles elevated safety alerts queries.
* **Key Functions:**
  * Retrieves escalated alerts (violations unacknowledged for >10 minutes).
  * Manages escalation triggers and queries for critical safety warnings.

### 2. [analytics.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/analytics.ts)
* **Purpose:** Supplies data aggregates to the Analytics page.
* **Key Functions:**
  * `getAnalyticsData()`: Queries database violations and computes groupings by site, PPE violation type (e.g. missing helmet), and daily violation trends.

### 3. [auth.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/auth.ts)
* **Purpose:** User authentication wrapper.
* **Key Functions:**
  * Facilitates registration, login redirect parameters, and session-checking mechanisms.

### 4. [dashboard.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/dashboard.ts)
* **Purpose:** Data engine for the Admin and Supervisor dashboards.
* **Key Functions:**
  * `getAdminStats()`: Concurrently queries total counts (workers, supervisors, pending, escalated), gathers the latest 5 violations, the latest 5 escalated alerts, and formats Recharts analytics datasets.
  * `getSupervisorStats()`: Retrieves corresponding supervisor statistics, including today's violations count and active cases requiring review.

### 5. [reports.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/reports.ts)
* **Purpose:** Handles safety reporting features.
* **Key Functions:**
  * Formats and compiles site violations history logs to support safety CSV downloads.

### 6. [supervisors.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/supervisors.ts)
* **Purpose:** Registry manager for safety supervisors.
* **Key Functions:**
  * `getSupervisors()`: Queries registered supervisor users and their active sites.
  * `createSupervisor()`: Registers a new supervisor user account in the database.

### 7. [violations.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/violations.ts)
* **Purpose:** Core management of PPE safety violations.
* **Key Functions:**
  * `getViolations()`: Returns all tracked safety incidents.
  * `acknowledgeViolation()`: Marks a violation status as "Acknowledged", linking the resolving supervisor and stopping the escalation timer.
  * `resolveViolation()`: Finalizes and resolves a logged safety violation.

### 8. [workers.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/workers.ts)
* **Purpose:** Registry manager for field workers.
* **Key Functions:**
  * `getWorkers()`: Queries workers lists supporting search filters, site dropdowns, and pagination.
  * `createWorker()`: Inserts a new worker profile record into the database.

### 9. [index.ts](file:///c:/Users/webux/Downloads/guard-ops/actions/index.ts)
* **Purpose:** Re-exports individual server actions for unified importing.
