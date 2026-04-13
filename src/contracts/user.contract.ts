import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
  UserPreferencesSchema,
  UserResourcesSchema,
  UserSchema,
} from '@/src/schema';

const authHeaderSchema = z.object({
  authorization: z.string(),
});

const o = oc.$route({ inputStructure: 'detailed', tags: ['Users'] });

export const userRoutes = {
  getCurrentUser: o
    .route({
      method: 'GET',
      path: '/api/users/me',
      summary: 'Get current authenticated user with role',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
      }),
    )
    .output(
      UserSchema.extend({
        role: z.enum(['user', 'admin']).optional(),
      }),
    ),

  updateUserProfile: o
    .route({
      method: 'PATCH',
      path: '/api/users/me',
      summary: 'Update current user profile (name, image)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: UserSchema.pick({ name: true, image: true }).partial(),
      }),
    )
    .output(UserSchema),

  getUserPreferences: o
    .route({
      method: 'GET',
      path: '/api/users/me/preferences',
      summary: 'Get current user preferences',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
      }),
    )
    .output(UserPreferencesSchema),

  updateUserPreferences: o
    .route({
      method: 'PATCH',
      path: '/api/users/me/preferences',
      summary:
        'Update user preferences (theme, fontSize, defaultSpeed, autoBookmark)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: UserPreferencesSchema.omit({
          userId: true,
          updatedAt: true,
        }).partial(),
      }),
    )
    .output(UserPreferencesSchema),

  checkUserResources: o
    .route({
      method: 'GET',
      path: '/api/users/{userId}/resources',
      summary:
        'Check user-associated resources (marks, reading progress) - Admin only',
    })
    .input(
      z.object({
        params: z.object({
          userId: z.string(),
        }),
        headers: authHeaderSchema,
      }),
    )
    .output(UserResourcesSchema),
} as const;
