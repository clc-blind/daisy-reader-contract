import { z } from 'zod';
import { UserPreferencesSchema, UserSchema } from '@/src/schema';

export const userRoutes = {
  // Current User (Web & Admin)
  getCurrentUser: {
    method: 'GET',
    path: '/api/users/me',
    headers: z.object({
      authorization: z.string(),
    }),
    responses: {
      200: UserSchema.extend({
        role: z.enum(['user', 'admin']).optional(),
      }),
    },
    summary: 'Get current authenticated user with role',
  },

  updateUserProfile: {
    method: 'PATCH',
    path: '/api/users/me',
    headers: z.object({
      authorization: z.string(),
    }),
    body: UserSchema.pick({ name: true, image: true }).partial(),
    responses: {
      200: UserSchema,
    },
    summary: 'Update current user profile (name, image)',
  },

  // User Preferences (Web only)
  getUserPreferences: {
    method: 'GET',
    path: '/api/users/me/preferences',
    headers: z.object({
      authorization: z.string(),
    }),
    responses: {
      200: UserPreferencesSchema,
    },
    summary: 'Get current user preferences',
  },

  updateUserPreferences: {
    method: 'PATCH',
    path: '/api/users/me/preferences',
    headers: z.object({
      authorization: z.string(),
    }),
    body: UserPreferencesSchema.omit({
      userId: true,
      updatedAt: true,
    }).partial(),
    responses: {
      200: UserPreferencesSchema,
    },
    summary:
      'Update user preferences (theme, fontSize, defaultSpeed, autoBookmark)',
  },
} as const;
