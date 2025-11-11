import { z } from 'zod';

export const ReadingProgressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bookId: z.string(),
  currentTimeSeconds: z.number(),
  currentPosition: z.string().nullable(),
  isCompleted: z.boolean(),
  lastReadAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ReadingProgress = z.infer<typeof ReadingProgressSchema>;
