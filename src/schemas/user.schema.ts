import { z } from 'zod';

// User (Better Auth)
export const UserSchema = z
  .object({
    id: z.string().describe('Unique user identifier'),
    name: z.string().describe('User display name'),
    email: z.string().email().describe('User email address'),
    emailVerified: z
      .boolean()
      .default(false)
      .describe('Whether email is verified'),
    image: z.string().nullable().optional().describe('User profile image URL'),
    createdAt: z.date().describe('Account creation timestamp'),
    updatedAt: z.date().describe('Last update timestamp'),
  })
  .describe('User entity');

// Account (Better Auth - OAuth providers)
export const AccountSchema = z
  .object({
    id: z.string().describe('Unique account identifier'),
    accountId: z.string().describe('Provider account ID'),
    providerId: z.string().describe('OAuth provider ID'),
    userId: z.string().describe('Associated user ID'),
    accessToken: z
      .string()
      .nullable()
      .optional()
      .describe('OAuth access token'),
    refreshToken: z
      .string()
      .nullable()
      .optional()
      .describe('OAuth refresh token'),
    idToken: z.string().nullable().optional().describe('OAuth ID token'),
    accessTokenExpiresAt: z
      .date()
      .nullable()
      .optional()
      .describe('Access token expiration'),
    refreshTokenExpiresAt: z
      .date()
      .nullable()
      .optional()
      .describe('Refresh token expiration'),
    scope: z.string().nullable().optional().describe('OAuth scope'),
    password: z
      .string()
      .nullable()
      .optional()
      .describe('Hashed password for credentials'),
    createdAt: z.date().describe('Account creation timestamp'),
    updatedAt: z.date().describe('Last update timestamp'),
  })
  .describe('User account entity');

// Session (Better Auth)
export const SessionSchema = z
  .object({
    id: z.string().describe('Unique session identifier'),
    expiresAt: z.date().describe('Session expiration timestamp'),
    token: z.string().describe('Session token'),
    createdAt: z.date().describe('Session creation timestamp'),
    updatedAt: z.date().describe('Last update timestamp'),
    ipAddress: z.string().nullable().optional().describe('Client IP address'),
    userAgent: z.string().nullable().optional().describe('Client user agent'),
    userId: z.string().describe('Associated user ID'),
  })
  .describe('User session entity');

// User Preferences
export const UserPreferencesSchema = z.object({
  userId: z.string().describe('Associated user ID'),
  theme: z.string().describe('UI theme preference'),
  fontSize: z.number().default(16).describe('Font size in pixels'),
  defaultSpeed: z.number().default(1.0).describe('Default playback speed'),
  autoBookmark: z.boolean().default(true).describe('Auto-bookmark on close'),
  updatedAt: z.date().describe('Last update timestamp'),
});

// User Resources Check
export const UserResourcesSchema = z.object({
  userId: z.string().describe('User ID'),
  marksCount: z.number().int().describe('Number of marks created by user'),
  readingProgressCount: z
    .number()
    .int()
    .describe('Number of reading progress records'),
  hasResources: z
    .boolean()
    .describe('Whether user has any associated resources'),
});

export type User = z.infer<typeof UserSchema>;
export type Account = z.infer<typeof AccountSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserResources = z.infer<typeof UserResourcesSchema>;
