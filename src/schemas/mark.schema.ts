import { z } from 'zod';

export const MarkSchema = z
  .object({
    id: z.string().describe('Unique mark identifier'),
    userId: z.string().describe('Associated user ID'),
    bookId: z.string().describe('Associated book ID'),
    type: z.enum(['highlight', 'note', 'bookmark']).describe('Mark type'),
    title: z.string().describe('Mark title'),
    selectedText: z.string().nullable().describe('Selected text content'),
    contextBefore: z.string().nullable().describe('Text before selection'),
    contextAfter: z.string().nullable().describe('Text after selection'),
    chapterId: z.string().nullable().describe('Associated chapter ID'),
    audioTimeSeconds: z
      .number()
      .nullable()
      .describe('Audio position in seconds'),
    textPosition: z.string().nullable().describe('Text position identifier'),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .nullable()
      .describe('Highlight color (hex format)'),
    content: z.string().nullable().describe('Note content'),
    isOrphan: z
      .boolean()
      .default(false)
      .describe('Whether mark position is lost'),
    createdAt: z.date().describe('Creation timestamp'),
    updatedAt: z.date().describe('Last update timestamp'),
  })
  .describe('Mark entity (highlight/note/bookmark)');

// DTO schemas
export const CreateMarkSchema = MarkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).describe('Create mark request body');

export const UpdateMarkSchema = MarkSchema.omit({
  id: true,
  userId: true,
  bookId: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .describe('Update mark request body');

export type Mark = z.infer<typeof MarkSchema>;
export type CreateMark = z.infer<typeof CreateMarkSchema>;
export type UpdateMark = z.infer<typeof UpdateMarkSchema>;
