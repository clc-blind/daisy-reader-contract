import { oc } from '@orpc/contract';
import { z } from 'zod';
import { CreateMarkSchema, MarkSchema } from '@/src/schema';

const authHeaderSchema = z.object({
  authorization: z.string(),
});

const o = oc.$route({ inputStructure: 'detailed', tags: ['Marks'] });

export const markRoutes = {
  createMark: o
    .route({
      method: 'POST',
      path: '/api/marks',
      summary: 'Create a new mark (highlight, note, bookmark)',
      successStatus: 201,
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: CreateMarkSchema,
      }),
    )
    .output(MarkSchema),

  getMarksByBook: o
    .route({
      method: 'GET',
      path: '/api/marks/{userId}/{bookId}',
      summary: 'Get all marks for a book by a user',
    })
    .input(
      z.object({
        params: z.object({
          userId: z.string(),
          bookId: z.string(),
        }),
      }),
    )
    .output(z.array(MarkSchema)),
} as const;
