# Workforce Safety Monitoring Platform - Setup Guide

## Project Initialization Complete ✅

The initial project foundation has been successfully set up. All placeholder files, configuration, and folder structure are in place.

## What's Been Done

### ✅ Dependencies Installed
- Next.js 16 with React 19
- TypeScript, Tailwind CSS v4, shadcn/ui
- React Hook Form + Zod for forms and validation
- Recharts for data visualization
- TanStack Table for data management
- Prisma ORM for database operations
- ESLint, Prettier for code quality

### ✅ Folder Structure Created
```
app/
├── (auth)/login           - Login page
├── (admin)/               - Admin dashboard and management
│   ├── dashboard
│   ├── supervisors
│   ├── alerts
│   └── analytics
├── (supervisor)/          - Supervisor dashboard
│   ├── dashboard
│   ├── violations
│   └── reports
└── api/                   - API routes

components/
├── ui/                    - shadcn/ui components
├── layout/               - Layout components (Header, Sidebar, etc.)
├── dashboard/            - Dashboard widgets & cards
├── charts/              - Chart components
├── forms/               - Form components
├── tables/              - Data table components
└── common/              - Common shared components

lib/
├── prisma.ts            - Prisma client singleton
├── auth.ts              - Authentication utilities
├── jwt.ts               - JWT token management
├── validations.ts       - Zod validation schemas
├── csv-export.ts        - CSV export utilities
├── escalation.ts        - Alert escalation logic
└── utils.ts             - General utilities

middleware.ts            - Route protection middleware
```

### ✅ Configuration Files
- `.env.example` - Environment variables template
- `tsconfig.json` - Strict TypeScript settings with path aliases
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Code formatting rules
- `package.json` - Updated with all scripts and dependencies

### ✅ Placeholder Pages
All pages are ready with proper routing structure:
- `/auth/login` - Authentication entry point
- `/admin/dashboard` - Admin dashboard
- `/admin/supervisors` - Supervisor management
- `/admin/alerts` - Alert management
- `/admin/analytics` - Analytics dashboard
- `/supervisor/dashboard` - Supervisor dashboard
- `/supervisor/violations` - Violation tracking
- `/supervisor/reports` - Report generation

### ✅ Database Setup
- Prisma schema initialized
- PostgreSQL configured
- Singleton Prisma client implemented
- Seed script template created

## Next Steps for Implementation

### Phase 1: Database & Models
1. **Define Prisma Models** (`prisma/schema.prisma`)
   - User model with roles (admin, supervisor, worker)
   - SafetyViolation model for tracking PPE violations
   - Alert model for safety alerts with escalation levels
   - Report model for generating reports
   - Timestamps and relationships between models

2. **Run Migrations**
   ```bash
   pnpm prisma:migrate
   ```

3. **Seed Initial Data** (`prisma/seed.ts`)
   ```bash
   npx ts-node prisma/seed.ts
   ```

### Phase 2: Authentication
1. **Implement JWT Auth** (`lib/jwt.ts`)
   - Token generation with user payload
   - Token verification and validation
   - Token refresh logic

2. **Implement Auth Routes** (`lib/auth.ts`)
   - Login endpoint
   - Logout endpoint
   - User verification

3. **Create Auth Actions** (`actions/auth.ts`)
   - Server action for login
   - Server action for logout
   - Session validation

4. **Implement Middleware** (`middleware.ts`)
   - Route protection by role
   - Redirect unauthorized users to login

### Phase 3: API Endpoints
Create RESTful API routes in `app/api/`:
- `/api/auth/login` - User authentication
- `/api/auth/logout` - User logout
- `/api/users` - User management
- `/api/alerts` - Safety alerts CRUD
- `/api/violations` - Violation tracking
- `/api/reports` - Report generation

### Phase 4: Forms & Validation
1. **Login Form** (`components/forms/LoginForm.tsx`)
   - Email and password validation
   - Error handling
   - Loading states

2. **Violation Form** (`components/forms/ViolationForm.tsx`)
   - PPE violation reporting
   - Image upload capability
   - Timestamp recording

3. **Alert Form** (`components/forms/AlertForm.tsx`)
   - Alert creation with escalation levels
   - Notification settings

### Phase 5: Dashboard Components
1. **Admin Dashboard** (`app/admin/dashboard/page.tsx`)
   - Statistics cards (total violations, alerts, etc.)
   - Recent alerts chart
   - User activity feed
   - Quick actions

2. **Supervisor Dashboard** (`app/supervisor/dashboard/page.tsx`)
   - Team statistics
   - Recent violations
   - PPE compliance status
   - Quick reporting

### Phase 6: Tables & Data Display
1. **Alerts Table** (`components/tables/AlertsTable.tsx`)
   - Sorting and filtering
   - Pagination
   - Status badges
   - Quick actions

2. **Violations Table** (`components/tables/ViolationsTable.tsx`)
   - Worker and location details
   - Violation type and severity
   - Timestamp and status

3. **Users Table** (`components/tables/UsersTable.tsx`)
   - User management
   - Role assignment
   - Activity status

### Phase 7: Charts & Analytics
1. **Safety Analytics** (`components/charts/SafetyChart.tsx`)
   - Violation trends over time
   - Compliance rates

2. **Alert Distribution** (`components/charts/AlertDistribution.tsx`)
   - Alerts by severity level
   - Alerts by location

## Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your PostgreSQL database URL

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Start dev server
pnpm dev
```

### Database Management
```bash
# Create migrations
pnpm prisma:migrate

# View database
pnpm prisma:studio

# Reset database (dev only)
pnpm prisma migrate reset
```

### Code Quality
```bash
# Format code
pnpm format

# Lint code
pnpm lint
```

## Key Architecture Decisions

1. **Server Components by Default** - Use Server Components for data fetching, only use Client Components when needed for interactivity
2. **Server Actions for Mutations** - All state-changing operations use Next.js Server Actions
3. **Type Safety** - Strict TypeScript throughout, validation with Zod
4. **Clean Separation** - Keep business logic in `lib/`, components in `components/`, routes in `app/`
5. **Reusable Components** - Keep components small (~200 lines max) and reusable

## Coding Standards to Follow

- **Imports**: Use absolute imports (`@/...`)
- **Styling**: Tailwind CSS classes only, no inline styles
- **Components**: Default to `'use server'`, use `'use client'` sparingly
- **Error Handling**: Implement try-catch in Server Actions
- **Validation**: Always validate inputs with Zod before database operations
- **Security**: Always filter database queries by authenticated user ID

## Important Files to Reference

- `lib/validations.ts` - Add all Zod schemas here
- `lib/auth.ts` - JWT and authentication logic
- `lib/utils.ts` - Reusable utility functions
- `types/index.ts` - Global TypeScript types
- `constants/index.ts` - App constants and routes

## Common Commands During Development

```bash
# Watch for compilation errors
pnpm dev

# Format all code before committing
pnpm format && pnpm lint

# Create new database migration after schema changes
pnpm prisma:migrate -- --name add_new_field

# View Prisma Studio (browser-based DB viewer)
pnpm prisma:studio
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Check credentials and connection string format

### Prisma Client Issues
```bash
# Regenerate Prisma client
pnpm prisma:generate

# Clear Prisma cache
rm -rf .next
pnpm dev
```

### TypeScript Errors
```bash
# Rebuild TypeScript
rm -rf .next
pnpm build
```

## Project Status

**Setup Status**: ✅ COMPLETE
**Ready for**: Database & Authentication Implementation
**Estimated Timeline**: Ready to begin Phase 1

---

The foundation is solid and maintainable. Follow the phases above to build out the complete feature set. All helper functions and utilities are already scaffolded and waiting to be implemented.
