import { z } from 'zod';
import { MarkSchema } from '@/src/schema';

export const markRoutes = {
  createMark: {
    method: 'POST',
    path: '/api/marks',
    headers: z.object({
      authorization: z.string(),
    }),
    body: MarkSchema.omit({ createdAt: true, updatedAt: true }),
    responses: {
      201: MarkSchema,
    },
    summary: 'Create a new mark (highlight, note, bookmark)',
  },

  getMarksByBook: {
    method: 'GET',
    path: '/api/marks/:userId/:bookId',
    responses: {
      200: z.array(MarkSchema),
    },
    summary: 'Get all marks for a book by a user',
  },
} as const;
