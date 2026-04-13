import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
  BookSchema,
  ReadingProgressSchema,
  UpdateReadingProgressSchema,
} from '@/src/schema';

const authHeaderSchema = z.object({
  authorization: z.string(),
});

const o = oc.$route({
  inputStructure: 'detailed',
  tags: ['Reading Progress'],
});

export const readingRoutes = {
  getRecentlyReadBooks: o
    .route({
      method: 'GET',
      path: '/api/progress/recent/{userId}',
      summary: 'Get recently read books for a user',
    })
    .input(
      z.object({
        params: z.object({
          userId: z.string(),
        }),
        query: z.object({
          limit: z.coerce.number().optional(),
        }),
      }),
    )
    .output(z.array(BookSchema)),

  getInprogressBooks: o
    .route({
      method: 'GET',
      path: '/api/progress/inprogress/{userId}',
      summary: 'Get in-progress books for a user',
    })
    .input(
      z.object({
        params: z.object({
          userId: z.string(),
        }),
        query: z.object({
          limit: z.coerce.number().optional(),
          offset: z.coerce.number().optional(),
        }),
      }),
    )
    .output(
      z.object({
        data: z.array(BookSchema),
        total: z.number(),
      }),
    ),

  updateReadingProgress: o
    .route({
      method: 'PATCH',
      path: '/api/progress/{id}',
      summary: 'Update reading progress',
    })
    .input(
      z.object({
        params: z.object({
          id: z.string(),
        }),
        headers: authHeaderSchema,
        body: UpdateReadingProgressSchema,
      }),
    )
    .output(ReadingProgressSchema),
} as const;
