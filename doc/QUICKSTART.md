# ⚡ Quick Start Guide

Get the Workforce Safety Monitoring Platform running in 5 minutes!

## Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database

## 1️⃣ Install Dependencies
```bash
pnpm install
```

## 2️⃣ Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/workforce_safety"
JWT_SECRET="your-secret-key-here-change-in-production"
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

## 3️⃣ Initialize Database
```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate
```

## 4️⃣ Start Development Server
```bash
pnpm dev
```

The app will be available at: **http://localhost:3000**

---

## 📂 Project Structure at a Glance

```
app/                    # Pages and routes
├── (auth)/login        # Login page
├── (admin)/            # Admin routes
└── (supervisor)/       # Supervisor routes

components/             # React components
├── ui/                 # shadcn/ui components
├── forms/              # Form components
├── tables/             # Data tables
└── ...

lib/                    # Utility functions
├── prisma.ts           # Database client
├── auth.ts             # Authentication
├── utils.ts            # Helper functions
└── ...

prisma/
└── schema.prisma       # Database schema
```

---

## 🛠️ Common Commands

```bash
# Development
pnpm dev                # Start dev server

# Code Quality
pnpm lint              # Run linter
pnpm format            # Format code

# Database
pnpm prisma:generate   # Generate Prisma client
pnpm prisma:migrate    # Run migrations
pnpm prisma:studio     # Open database GUI

# Build
pnpm build             # Build for production
pnpm start             # Start production server
```

---

## 📋 What's Ready

- ✅ Next.js 16 with TypeScript
- ✅ Tailwind CSS with design tokens
- ✅ Database setup with Prisma
- ✅ 8 route pages with placeholders
- ✅ Component structure organized
- ✅ All utilities scaffolded
- ✅ ESLint & Prettier configured

---

## 🎯 Next Steps

1. **Define Database Models** - Edit `prisma/schema.prisma`
2. **Run Migrations** - `pnpm prisma:migrate`
3. **Implement Authentication** - Complete `lib/auth.ts`
4. **Create API Routes** - Add endpoints in `app/api/`
5. **Build Dashboard UI** - Create components

---

## 📚 More Information

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`
- **README**: See `README.md`

---

## ❓ Troubleshooting

### "Cannot find module '@/...'"
```bash
# Regenerate TypeScript
rm -rf .next
pnpm dev
```

### Database connection errors
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Ensure database exists and credentials are correct

### Port already in use
```bash
# Run on different port
pnpm dev -- -p 3001
```

---

## 🚀 You're All Set!

Your development environment is ready. Start building amazing features! 🎉

Need help? Check the documentation files or review the code comments for TODOs.
