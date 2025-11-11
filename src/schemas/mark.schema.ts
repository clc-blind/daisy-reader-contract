import { z } from 'zod';

export const MarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bookId: z.string(),
  type: z.enum(['highlight', 'note', 'bookmark']),
  title: z.string(),
  selectedText: z.string().nullable(),
  contextBefore: z.string().nullable(),
  contextAfter: z.string().nullable(),
  chapterId: z.string().nullable(),
  audioTimeSeconds: z.number().nullable(),
  textPosition: z.string().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable(),
  content: z.string().nullable(),
  isOrphan: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Mark = z.infer<typeof MarkSchema>;
