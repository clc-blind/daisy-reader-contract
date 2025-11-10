import { z } from 'zod';
import { BookSchema, ReadingProgressSchema } from '@/src/schema';

export const readingRoutes = {
  getRecentlyReadBooks: {
    method: 'GET',
    path: '/progress/recent/:userId',
    query: z.object({ limit: z.coerce.number().optional() }),
    responses: {
      200: z.array(BookSchema),
    },
    summary: 'Get recently read books for a user',
  },

  getInprogressBooks: {
    method: 'GET',
    path: '/progress/inprogress/:userId',
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
    summary: 'Get in-progress books for a user',
  },

  updateReadingProgress: {
    method: 'PATCH',
    path: '/progress/:id',
    headers: z.object({
      authorization: z.string(),
    }),
    body: ReadingProgressSchema.omit({
      id: true,
    }).partial({
      currentPosition: true,
      currentTimeSeconds: true,
      isCompleted: true,
      updatedAt: true,
      createdAt: true,
    }),
    responses: {
      200: ReadingProgressSchema.partial({
        currentPosition: true,
      }),
    },
    summary: 'Update reading progress',
  },
} as const;
