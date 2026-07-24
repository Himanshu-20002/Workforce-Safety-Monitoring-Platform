/**
 * Global type definitions
 */

export type UserRole = 'admin' | 'supervisor' | 'worker';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: Date;
}
