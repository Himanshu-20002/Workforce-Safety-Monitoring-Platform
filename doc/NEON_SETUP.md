# Neon Database Setup Guide

## Quick Start

Your Workforce Safety Monitoring Platform is now configured with **Neon PostgreSQL + Drizzle ORM + Better Auth**.

### 1. Database Schema Setup

The Neon MCP will handle all database schema creation. You need to create the Better Auth tables and app tables.

#### Create Better Auth Tables (Required)

Better Auth requires 4 core tables. Execute these SQL commands through the Neon MCP:

```sql
CREATE TABLE "user" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "session" (
  "id" text NOT NULL PRIMARY KEY,
  "expiresAt" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE cascade
);

CREATE TABLE "account" (
  "id" text NOT NULL PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  "scope" text,
  "password" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "verification" (
  "id" text NOT NULL PRIMARY KEY,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);
```

#### Create App Tables

```sql
CREATE TABLE "user_role" (
  "id" text NOT NULL PRIMARY KEY,
  "userId" text NOT NULL,
  "role" varchar(20) NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "alert" (
  "id" text NOT NULL PRIMARY KEY,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "severity" varchar(20) NOT NULL DEFAULT 'medium',
  "status" varchar(20) NOT NULL DEFAULT 'open',
  "category" varchar(50) NOT NULL,
  "userId" text NOT NULL,
  "locationId" text,
  "violationId" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "resolvedAt" timestamp
);

CREATE TABLE "violation" (
  "id" text NOT NULL PRIMARY KEY,
  "type" varchar(50) NOT NULL,
  "description" text NOT NULL,
  "severity" varchar(20) NOT NULL DEFAULT 'medium',
  "status" varchar(20) NOT NULL DEFAULT 'open',
  "workerId" text NOT NULL,
  "assignedToId" text,
  "locationId" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "resolvedAt" timestamp,
  "resolution" text
);

CREATE TABLE "location" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "description" text,
  "riskLevel" varchar(20) NOT NULL DEFAULT 'medium',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "report" (
  "id" text NOT NULL PRIMARY KEY,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "type" varchar(20) NOT NULL,
  "userId" text NOT NULL,
  "alertCount" text NOT NULL DEFAULT '0',
  "violationCount" text NOT NULL DEFAULT '0',
  "data" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "generatedAt" timestamp
);
```

### 2. Environment Variables

Verify these are set in your project settings:

- **DATABASE_URL** - Auto-provisioned by Neon integration
- **BETTER_AUTH_SECRET** - Already configured (32-char random string)

### 3. Test the Authentication

1. Open http://localhost:3000 in your browser
2. You'll be redirected to `/sign-in`
3. Create a new account or sign in
4. Upon successful auth, you'll be redirected to `/admin/dashboard`

### 4. Understanding the Architecture

**File Structure:**

```
lib/
  ├── auth.ts              ← Better Auth server config
  ├── auth-client.ts       ← Better Auth React client (browser)
  └── db/
      ├── index.ts         ← Drizzle client + pool
      └── schema.ts        ← Database schema (Better Auth + app tables)

app/
  ├── api/auth/[...all]/   ← Better Auth HTTP handler
  ├── sign-in/             ← Login page
  ├── sign-up/             ← Signup page  (optional)
  ├── admin/               ← Admin routes
  └── supervisor/          ← Supervisor routes

middleware.ts             ← Route protection based on session cookies
```

**How It Works:**

1. **Sign In** → User submits credentials → Better Auth validates → Session cookie created
2. **Middleware** → Checks for session cookie → Redirects unauthenticated users to `/sign-in`
3. **Protected Routes** → Server Components read session with `auth.api.getSession()`
4. **Database Queries** → Use `db` from Drizzle ORM with `getUserId()` pattern for scoping

### 5. Server Actions Pattern (Per-User Data)

All server actions must scope data by `userId`. Example:

```typescript
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { alert } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getAlerts() {
  const userId = await getUserId()
  return db
    .select()
    .from(alert)
    .where(eq(alert.userId, userId))
}
```

### 6. Client Components with Sessions

Access user info in client components:

```typescript
'use client'

import { useSession } from '@/lib/auth-client'

export function Profile() {
  const { data: session } = useSession()
  
  if (!session?.user) return null
  
  return <div>Welcome, {session.user.name}!</div>
}
```

### 7. Create Demo Data (Optional)

Once tables are created, you can manually insert demo users:

```sql
INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
VALUES 
  ('user-1', 'Admin User', 'admin@example.com', true, now(), now()),
  ('user-2', 'Supervisor User', 'supervisor@example.com', true, now(), now()),
  ('user-3', 'John Worker', 'worker1@example.com', true, now(), now());

-- Then use Better Auth's password hashing in your app to set passwords
```

### 8. Useful Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Format code
pnpm format

# Lint code
pnpm lint
```

### 9. Security Best Practices

✅ **Already Implemented:**
- HTTP-only cookies (prevents JavaScript access)
- Secure flag in production
- Session expiration (7 days)
- Middleware-level route protection
- Type-safe Drizzle ORM queries

✅ **Before Production:**
- Set NODE_ENV=production
- Enable HTTPS (required for secure cookies)
- Review CORS settings
- Implement rate limiting on /api/auth endpoints
- Set up monitoring and logging

### 10. Troubleshooting

**Q: "Session cookie not being set"**
- A: In development, `sameSite: 'none', secure: true` is required for cross-site iframe cookies (see lib/auth.ts)

**Q: "Can't query data with Drizzle"**
- A: Always include `eq(table.userId, userId)` in your `where` clause for per-user scoping

**Q: "BETTER_AUTH_SECRET not found"**
- A: Check that it's set in your project's environment variables

**Q: "Database connection error"**
- A: Verify DATABASE_URL is set and your Neon project is active

### 11. Next Steps

1. ✅ Create all database tables (see section 1)
2. ✅ Test authentication at http://localhost:3000
3. Build admin features (user management, alerts, violations)
4. Add role-based access control based on user role field
5. Implement API endpoints for CRUD operations
6. Add real-time notifications (WebSockets)
7. Deploy to Vercel

---

**Status:** Ready for development with Neon PostgreSQL + Drizzle + Better Auth

All authentication and database infrastructure is in place. Start building features!
