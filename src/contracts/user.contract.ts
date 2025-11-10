import { z } from 'zod';
import { UserSchema } from '@/src/schema';

export const userRoutes = {
  getUserById: {
    method: 'GET',
    path: '/users/:id',
    headers: z.object({
      authorization: z.string(),
    }),
    responses: {
      200: UserSchema,
    },
    summary: 'Get a user by ID',
  },

  updateUser: {
    method: 'PATCH',
    path: '/users/:id',
    headers: z.object({
      authorization: z.string(),
    }),
    body: UserSchema.pick({ name: true, image: true }).partial(),
    responses: {
      200: UserSchema,
    },
    summary: 'Update user profile',
  },
} as const;
