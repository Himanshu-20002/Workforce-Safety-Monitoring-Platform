# Workforce Safety Monitoring Platform

A clean, maintainable, and scalable full-stack web application for monitoring workforce safety, PPE compliance, and managing safety alerts. Built with modern technologies and designed for easy extension.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Table for data management
- **Charting**: Recharts for analytics visualizations
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT-based (to be implemented)
- **DevTools**: ESLint, Prettier, TypeScript

## Project Structure

```
├── app/                     # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (admin)/            # Admin dashboard and management
│   ├── (supervisor)/       # Supervisor dashboard and tools
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
│
├── components/             # Reusable React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── dashboard/         # Dashboard-specific components
│   ├── charts/            # Chart components
│   ├── forms/             # Form components
│   ├── tables/            # Table components
│   └── common/            # Common/shared components
│
├── lib/                    # Utility functions and helpers
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # Authentication utilities
│   ├── jwt.ts             # JWT token management
│   ├── validations.ts     # Zod validation schemas
│   ├── csv-export.ts      # CSV export functionality
│   ├── escalation.ts      # Alert escalation logic
│   └── utils.ts           # General utility functions
│
├── actions/               # Server actions (Next.js)
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
├── prisma/                # Prisma configuration
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
│
├── middleware.ts          # Next.js middleware
├── .env.example          # Environment variables example
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and other secrets
   ```

3. **Initialize Prisma**:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio

## Coding Standards

- **TypeScript**: Strict mode enforced
- **Components**: Server Components by default, Client Components only when necessary
- **Styling**: Tailwind CSS with shadcn/ui components
- **Code Style**: ESLint + Prettier
- **Component Size**: Keep components under ~200 lines for readability
- **Imports**: Use absolute imports (`@/...`)

## Next Steps

The project foundation is complete. The following tasks are ready for implementation:

1. **Database Models** - Define Prisma models for users, safety violations, alerts, etc.
2. **Authentication** - Implement JWT-based authentication
3. **API Endpoints** - Build REST API routes for core functionality
4. **Dashboard UI** - Create dashboard components and pages
5. **Forms** - Build form components with validation
6. **Charts & Analytics** - Implement data visualization
7. **Tables** - Create data tables with TanStack Table

## Key Features (To Implement)

- User authentication (Admin, Supervisor, Worker roles)
- Real-time PPE compliance monitoring
- Safety alert system with escalation
- Violation tracking and reporting
- Analytics and dashboards
- CSV export functionality
- User and supervisor management

## Development Notes

- All placeholder files include TODO comments indicating where to implement features
- The project uses Tailwind v4 with CSS variables for theming
- Prisma client is configured as a singleton for development
- Middleware is configured but awaits authentication implementation

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

---

**Status**: Project setup complete. Ready for feature development.
