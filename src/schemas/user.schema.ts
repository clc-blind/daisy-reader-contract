import { z } from 'zod';

// User (Better Auth)
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Account (Better Auth - OAuth providers)
export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  idToken: z.string().nullable().optional(),
  accessTokenExpiresAt: z.date().nullable().optional(),
  refreshTokenExpiresAt: z.date().nullable().optional(),
  scope: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Session (Better Auth)
export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  userId: z.string(),
});

// User Preferences
export const UserPreferencesSchema = z.object({
  userId: z.string(),
  theme: z.string(),
  fontSize: z.number().default(16),
  defaultSpeed: z.number().default(1.0),
  autoBookmark: z.boolean().default(true),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type Account = z.infer<typeof AccountSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
