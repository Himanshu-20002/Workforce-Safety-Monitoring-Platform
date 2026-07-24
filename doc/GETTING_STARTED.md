## Getting Started - Workforce Safety Monitoring Platform

### Prerequisites

- Node.js 18+ and pnpm installed
- PostgreSQL database (local or remote)
- Text editor (VS Code recommended)

---

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Database
Create `.env.local` file with your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/workforce_safety"
```

### 3. Initialize Database
```bash
pnpm setup:db
```

This will:
- Run Prisma migrations
- Seed demo data (users, locations, violations, alerts)

### 4. Start Dev Server
```bash
pnpm dev
```

### 5. Access the App
Open http://localhost:3000 in your browser

---

## Test RBAC System

### 1. Login as Admin
- URL: http://localhost:3000/auth/login
- Email: `admin@example.com`
- Password: `admin123`
- Redirects to: http://localhost:3000/admin/dashboard

### 2. Login as Supervisor
- Email: `supervisor@example.com`
- Password: `supervisor123`
- Redirects to: http://localhost:3000/supervisor/dashboard

### 3. Login as Worker
- Email: `worker1@example.com`
- Password: `worker123`
- Redirects to: http://localhost:3000/supervisor/dashboard

---

## Available Commands

```bash
# Development
pnpm dev                # Start dev server with HMR

# Database
pnpm setup:db           # Migrate and seed database
pnpm prisma migrate dev # Run migrations
pnpm prisma db seed     # Seed demo data
pnpm prisma studio     # Open Prisma Studio GUI

# Code Quality
pnpm lint              # Run ESLint
pnpm format            # Format with Prettier
pnpm build             # Build for production

# Production
pnpm start             # Start production server
```

---

## Project Structure

```
Workforce Safety Monitoring Platform/
├── app/                          # Next.js app directory
│   ├── auth/login/              # Login page
│   ├── admin/                   # Admin routes (protected)
│   ├── supervisor/              # Supervisor routes
│   └── layout.tsx               # Root layout
├── components/                  # React components
│   ├── forms/login-form.tsx    # Login form
│   ├── layout/navbar.tsx        # Navigation bar
│   └── dashboard/               # Dashboard components
├── lib/                         # Utilities
│   ├── auth.ts                  # Authentication functions
│   ├── prisma.ts               # Prisma client
│   └── validations.ts          # Zod schemas
├── actions/                     # Server actions
│   └── auth.ts                  # Authentication actions
├── hooks/                       # Custom React hooks
│   └── use-session.ts          # Session hook
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── types/                       # TypeScript types
├── middleware.ts                # Route protection
└── package.json                # Dependencies

Documentation Files:
├── README.md                    # Project overview
├── GETTING_STARTED.md          # This file
├── SETUP_GUIDE.md              # Detailed setup
├── RBAC_IMPLEMENTATION.md      # RBAC details
├── RBAC_SUMMARY.md             # RBAC overview
├── PROJECT_SUMMARY.md          # Project inventory
├── QUICKSTART.md               # 5-minute start
└── COMPLETION_REPORT.md        # Setup report
```

---

## Database Setup (Detailed)

### Using PostgreSQL Locally (macOS/Linux)

```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database
createdb workforce_safety

# Update .env.local
DATABASE_URL="postgresql://localhost:5432/workforce_safety"
```

### Using PostgreSQL Locally (Windows)

```bash
# Download PostgreSQL installer from postgresql.org
# Install with default settings
# Password: postgres

# Create database via pgAdmin GUI
# Or via command line:
psql -U postgres -c "CREATE DATABASE workforce_safety;"

# Update .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/workforce_safety"
```

### Using Remote Database (Neon, Supabase, etc.)

1. Create PostgreSQL database on your hosting provider
2. Get connection string (looks like: `postgresql://user:pass@host/dbname`)
3. Update `.env.local` with connection string
4. Run `pnpm setup:db`

---

## Features Overview

### Admin Dashboard
- View system-wide statistics
- Manage supervisors and users
- Access all alerts and violations
- Generate system analytics

### Supervisor Dashboard
- View site-specific violations
- Manage worker compliance
- Generate reports
- Assign violations to investigation

### Security Features
- Role-based access control (RBAC)
- HTTP-only cookies for session storage
- Automatic session expiration
- Middleware-level route protection
- TypeScript for type safety

---

## Common Issues & Solutions

### Issue: Cannot Connect to Database
```
Error: getaddrinfo ENOTFOUND

Solution:
1. Verify DATABASE_URL in .env.local
2. Check PostgreSQL is running
3. Verify database name exists
4. Test connection: psql <DATABASE_URL>
```

### Issue: Cannot Login
```
Error: Invalid email or password

Solution:
1. Run pnpm prisma db seed to reset database
2. Use demo credentials exactly:
   - Email: admin@example.com (not admin@example)
   - Password: admin123 (not admin)
3. Check database is populated: pnpm prisma studio
```

### Issue: Build Fails
```
Solution:
1. Delete node_modules and .pnpm-store
2. Run: pnpm install
3. Run: pnpm build
4. Check TypeScript: pnpm tsc --noEmit
```

### Issue: Port 3000 Already in Use
```
Solution:
# Use different port
pnpm dev -- -p 3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

---

## Next Steps

1. **Read Documentation**
   - RBAC_IMPLEMENTATION.md - Understand authentication
   - SETUP_GUIDE.md - Full setup and phases

2. **Explore Codebase**
   - Look at `components/` for component patterns
   - Check `lib/auth.ts` for authentication logic
   - Review `prisma/schema.prisma` for database structure

3. **Customize**
   - Update branding in `components/layout/navbar.tsx`
   - Modify colors in `app/globals.css`
   - Add your own users via Prisma Studio

4. **Deploy**
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables
   - Deploy!

---

## Development Tips

### Using Prisma Studio (GUI)
```bash
pnpm prisma studio
# Opens http://localhost:5555
# View and edit database visually
```

### Adding New Users
```bash
# Option 1: Use Prisma Studio (easier)
pnpm prisma studio

# Option 2: Modify seed.ts and reseed
# Edit prisma/seed.ts, then:
pnpm prisma db seed
```

### Hot Module Replacement
```bash
# Dev server automatically reloads on file changes
pnpm dev
# Just save files, browser auto-refreshes
```

### Debugging
```typescript
// Add debug logs
console.log("[v0]", variable);

// Use browser DevTools
// - Application > Cookies to see auth_token
// - Console to see client logs
// - Network to see API calls
```

---

## Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React**: https://react.dev

---

## Need Help?

1. Check the documentation files:
   - RBAC_IMPLEMENTATION.md - Authentication details
   - SETUP_GUIDE.md - Implementation phases
   - PROJECT_SUMMARY.md - File inventory

2. Review code comments - Most functions have `//` comments explaining logic

3. Check TypeScript errors - Helpful error messages in your editor

4. Run diagnostics:
   ```bash
   pnpm build        # Check for build errors
   pnpm lint         # Check for code issues
   pnpm tsc --noEmit # Check TypeScript
   ```

---

## What's Included

✓ Full authentication system with JWT-like sessions
✓ Role-based access control (3 roles)
✓ Protected routes with middleware
✓ Professional login form
✓ Navigation bar with user info
✓ Admin and supervisor dashboards
✓ Prisma database schema
✓ Demo data seeding
✓ TypeScript for type safety
✓ Tailwind CSS styling
✓ ESLint and Prettier configured
✓ Production-ready structure

---

## Ready to Build?

You now have a complete, production-ready foundation!

Next Phase: Build out the admin and supervisor features:
- User management interfaces
- Alert and violation management
- Report generation
- Real-time notifications

Happy coding!
