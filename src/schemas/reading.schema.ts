import { z } from 'zod';

export const ReadingProgressSchema = z
  .object({
    id: z.string().describe('Unique reading progress identifier'),
    userId: z.string().describe('Associated user ID'),
    bookId: z.string().describe('Associated book ID'),
    currentTimeSeconds: z.number().describe('Current playback time in seconds'),
    currentPosition: z.string().nullable().describe('Current position in book'),
    isCompleted: z.boolean().describe('Whether book is completed'),
    lastReadAt: z.date().describe('Last read timestamp'),
    createdAt: z.date().describe('Creation timestamp'),
    updatedAt: z.date().describe('Last update timestamp'),
  })
  .describe('Reading progress entity');

// DTO schemas
export const CreateReadingProgressSchema = ReadingProgressSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).describe('Create reading progress request body');

export const UpdateReadingProgressSchema = ReadingProgressSchema.omit({
  id: true,
  userId: true,
  bookId: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .describe('Update reading progress request body');

export type ReadingProgress = z.infer<typeof ReadingProgressSchema>;
export type CreateReadingProgress = z.infer<typeof CreateReadingProgressSchema>;
export type UpdateReadingProgress = z.infer<typeof UpdateReadingProgressSchema>;
