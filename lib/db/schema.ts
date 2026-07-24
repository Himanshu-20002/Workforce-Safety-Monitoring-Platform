import { pgTable, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: varchar('role', { length: 20 }).notNull().default('worker'), // 'admin', 'supervisor', 'worker'
  employeeId: text('employeeId'),
  site: text('site'),
  status: text('status').default('Active'),
  jobProfile: text('jobProfile'),
  mobileNumber: text('mobileNumber'),
  aadharNumber: text('aadharNumber'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// --- App tables with RBAC support ------------------------------------------

export const userRole = pgTable('user_role', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'admin', 'supervisor', 'worker'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const alert = pgTable('alert', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', { length: 20 }).notNull().default('medium'), // low, medium, high, critical
  status: varchar('status', { length: 20 }).notNull().default('open'), // open, acknowledged, resolved
  category: varchar('category', { length: 50 }).notNull(), // ppe_missing, improper_ppe, etc.
  userId: text('userId').notNull(),
  locationId: text('locationId'),
  violationId: text('violationId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  resolvedAt: timestamp('resolvedAt'),
});

export const violation = pgTable('violation', {
  id: text('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', { length: 20 }).notNull().default('medium'),
  status: varchar('status', { length: 20 }).notNull().default('open'),
  workerId: text('workerId').notNull(),
  assignedToId: text('assignedToId'),
  locationId: text('locationId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  resolvedAt: timestamp('resolvedAt'),
  acknowledgedAt: timestamp('acknowledgedAt'),
  resolution: text('resolution'),
});

export const location = pgTable('location', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  riskLevel: varchar('riskLevel', { length: 20 }).notNull().default('medium'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const report = pgTable('report', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // daily, weekly, monthly, incident
  userId: text('userId').notNull(),
  alertCount: text('alertCount').notNull().default('0'),
  violationCount: text('violationCount').notNull().default('0'),
  data: text('data'), // JSON data for reports
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  generatedAt: timestamp('generatedAt'),
});
