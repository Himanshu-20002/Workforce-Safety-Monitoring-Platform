## Role-Based Access Control (RBAC) Implementation Guide

### Overview

This document describes the complete RBAC system implemented in the Workforce Safety Monitoring Platform. The system supports three user roles with different access levels and permissions.

---

## User Roles

### 1. Admin Role
**Permissions:**
- Full system access
- Manage supervisors and users
- View all alerts and violations
- Generate system-wide analytics
- Configure system settings
- Access admin dashboard

**Routes:**
- `/admin/dashboard` - Main admin dashboard
- `/admin/supervisors` - Manage all supervisors
- `/admin/alerts` - View and manage all alerts
- `/admin/analytics` - System-wide analytics

### 2. Supervisor Role
**Permissions:**
- Manage assigned violations
- View violations in their location
- Generate reports
- Access supervisor dashboard
- View alerts related to their area
- Manage worker PPE compliance

**Routes:**
- `/supervisor/dashboard` - Supervisor dashboard
- `/supervisor/violations` - Manage violations
- `/supervisor/reports` - Generate reports

### 3. Worker Role
**Permissions:**
- View their own violations
- View assigned alerts
- Limited dashboard access
- Submit incident reports

**Routes:**
- `/supervisor/dashboard` - Redirected to same dashboard as supervisors
- Read-only access to violations

---

## Architecture Components

### 1. Database Layer (Prisma)

**User Model**
```prisma
model User {
  id            String
  email         String @unique
  password      String
  name          String
  role          UserRole (ADMIN, SUPERVISOR, WORKER)
  isActive      Boolean
  lastLogin     DateTime?
  createdAt     DateTime
  updatedAt     DateTime
}
```

**Related Models**
- Alert - Safety alerts assigned to users
- Violation - PPE/safety violations tracked by supervisors
- Location - Work sites/areas managed by supervisors
- Report - Generated safety reports

### 2. Authentication (`lib/auth.ts`)

**Key Functions:**
- `createSession(userId, email, role)` - Creates session object
- `setSessionCookie(session)` - Sets HTTP-only cookie with session data
- `getSession()` - Retrieves current session from cookie
- `clearSession()` - Clears session on logout
- `hasRole(userRole, requiredRoles)` - Checks user permissions
- `getRoleBasedRoute(role)` - Returns dashboard URL for role

### 3. Server Actions (`actions/auth.ts`)

**Available Actions:**
- `loginUser(email, password)` - Authenticates user, creates session
- `logoutUser()` - Clears session and logs user out
- `createUser(email, password, name, role)` - Admin creates new user
- `updateUserStatus(userId, isActive)` - Admin enables/disables user

**Usage:**
```typescript
const result = await loginUser('admin@example.com', 'admin123');
if (result.success) {
  // User authenticated, session cookie set
}
```

### 4. Route Protection Middleware (`middleware.ts`)

**Protected Routes Configuration:**
```typescript
const PROTECTED_ROUTES = {
  '/admin': ['admin'],           // Only admins
  '/supervisor': ['admin', 'supervisor'],  // Admins and supervisors
  '/api/admin': ['admin'],       // Admin APIs only
  '/api/supervisor': ['admin', 'supervisor'], // Admin/supervisor APIs
};
```

**Middleware Logic:**
1. Check if user has valid session cookie
2. Verify session hasn't expired
3. Match requested route against protected routes
4. Check if user's role is authorized for the route
5. Redirect to appropriate dashboard if unauthorized

### 5. Client-Side Session Hook (`hooks/use-session.ts`)

**Usage:**
```typescript
'use client';

const { session, isLoading } = useSession();

if (session?.role === 'admin') {
  // Show admin features
}
```

### 6. UI Components

**Login Form** (`components/forms/login-form.tsx`)
- Email/password input
- Error handling
- Demo credentials display
- Automatic dashboard redirect on successful login

**Navbar** (`components/layout/navbar.tsx`)
- Displays current user info and role badge
- Shows role-specific navigation links
- Logout button with redirect

**Dashboards**
- Admin Dashboard - System overview, statistics
- Supervisor Dashboard - Site-specific data, violations
- Worker Dashboard - Redirected to supervisor dashboard

---

## Demo Credentials

Use these credentials to test different roles:

```
Admin User:
  Email: admin@example.com
  Password: admin123

Supervisor:
  Email: supervisor@example.com
  Password: supervisor123

Worker:
  Email: worker1@example.com
  Password: worker123
```

---

## Authentication Flow

### Login Process

1. User enters email/password in login form
2. Form calls `loginUser()` server action
3. Server validates credentials against Prisma database
4. If valid:
   - Session created with user data and role
   - Session stored in HTTP-only cookie
   - User redirected to role-based dashboard
5. If invalid:
   - Error message displayed to user
   - No session created

### Access Protected Routes

1. User navigates to protected route (e.g., `/admin/dashboard`)
2. Middleware intercepts request
3. Middleware extracts session from cookie
4. Middleware checks if role is authorized for route
5. If authorized: Route accessed normally
6. If unauthorized: User redirected to their dashboard

### Logout Process

1. User clicks logout button
2. `logoutUser()` server action called
3. Session cookie deleted
4. User redirected to `/auth/login`

---

## Security Features

### Implemented

- HTTP-only cookies for session storage (cannot be accessed by JavaScript)
- Session expiration (24 hours)
- Role-based route protection in middleware
- Type-safe role definitions (TypeScript enums)
- Password validation on login (plaintext - upgrade to bcrypt in production)

### To Implement (Production)

1. **Password Hashing**
   ```typescript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   const isValid = await bcrypt.compare(password, user.password);
   ```

2. **CSRF Protection**
   - Use SameSite cookie flag (already configured)
   - Implement CSRF tokens for state-changing operations

3. **Rate Limiting**
   - Implement rate limiting on login endpoint
   - Prevent brute force attacks

4. **Audit Logging**
   - Log all authentication events
   - Log access to sensitive pages/APIs

5. **Multi-Factor Authentication**
   - Add optional 2FA for admin users

---

## File Structure

```
app/
├── auth/login/page.tsx          # Login page
├── admin/
│   ├── layout.tsx               # Admin layout with navbar
│   ├── dashboard/page.tsx       # Admin dashboard
│   ├── supervisors/page.tsx     # Supervisor management
│   ├── alerts/page.tsx          # Alert management
│   └── analytics/page.tsx       # Analytics dashboard
├── supervisor/
│   ├── layout.tsx               # Supervisor layout with navbar
│   ├── dashboard/page.tsx       # Supervisor dashboard
│   ├── violations/page.tsx      # Violation management
│   └── reports/page.tsx         # Report generation

components/
├── forms/login-form.tsx         # Login form component
├── layout/navbar.tsx            # Navigation bar with user info
├── dashboard/
│   ├── admin-dashboard.tsx      # Admin dashboard component
│   └── supervisor-dashboard.tsx # Supervisor dashboard component

lib/
├── auth.ts                      # Authentication utilities
├── prisma.ts                    # Prisma client
├── validations.ts               # Zod schemas

actions/
├── auth.ts                      # Server actions for auth

middleware.ts                    # Route protection middleware

prisma/
├── schema.prisma                # Database schema with roles
├── seed.ts                      # Demo data seeding
```

---

## Testing the RBAC System

### 1. Setup Database

```bash
# Create database and run migrations
pnpm setup:db

# Or manually:
# pnpm prisma migrate dev
# pnpm prisma db seed
```

### 2. Test Admin Access

```
1. Go to http://localhost:3000/auth/login
2. Enter admin@example.com / admin123
3. Should redirect to /admin/dashboard
4. Should see admin-specific navigation and content
```

### 3. Test Supervisor Access

```
1. Go to http://localhost:3000/auth/login
2. Enter supervisor@example.com / supervisor123
3. Should redirect to /supervisor/dashboard
4. Should NOT have access to /admin/*
5. Attempting /admin/alerts should redirect to /supervisor/dashboard
```

### 4. Test Route Protection

```
1. Without login, visit /admin/dashboard
2. Should redirect to /auth/login
3. Login as supervisor
4. Try accessing /admin/dashboard
5. Should redirect to /supervisor/dashboard
```

### 5. Test Logout

```
1. Login as any user
2. Click logout button in navbar
3. Should redirect to /auth/login
4. Attempting to visit /admin/dashboard should require login again
```

---

## Extending RBAC

### Adding New Roles

1. Update `types/index.ts`:
```typescript
export type UserRole = 'admin' | 'supervisor' | 'worker' | 'viewer';
```

2. Update Prisma schema:
```prisma
enum UserRole {
  ADMIN
  SUPERVISOR
  WORKER
  VIEWER
}
```

3. Update `middleware.ts` with new route permissions
4. Create layout and dashboard for new role

### Adding New Protected Routes

1. Update `PROTECTED_ROUTES` in `middleware.ts`:
```typescript
const PROTECTED_ROUTES = {
  '/reports': ['admin', 'supervisor'],
  // ...
};
```

2. Add corresponding pages/API routes

### Adding Role-Specific API Endpoints

Create API route with role check:
```typescript
// app/api/admin/users/route.ts
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Handle admin-only logic
}
```

---

## Troubleshooting

### Issue: Always Redirected to Login

**Solution:**
- Verify database connection in `.env.local`
- Check Prisma migrations are applied
- Verify seed data was created

### Issue: Cannot Login with Demo Credentials

**Solution:**
```bash
# Reseed database
pnpm prisma db seed

# Check database directly
pnpm prisma studio
```

### Issue: Session Not Persisting

**Solution:**
- Verify cookies are enabled in browser
- Check browser DevTools > Application > Cookies
- Verify `auth_token` cookie exists after login

### Issue: Wrong Dashboard After Login

**Solution:**
- Check user's role in database
- Verify `getRoleBasedRoute()` function matches role
- Check middleware route configuration

---

## Next Steps

1. Implement password hashing with bcrypt
2. Add email verification on signup
3. Implement OAuth (Google, Microsoft)
4. Add permission-based access (not just role-based)
5. Implement audit logging for all actions
6. Add 2FA for admin users
7. Create user management UI for admins
8. Add role-specific API endpoints

---

**RBAC Implementation Status:** Complete and Ready for Testing
