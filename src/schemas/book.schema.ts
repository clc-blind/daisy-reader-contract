import { z } from 'zod';

export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  creator: z.string().nullable(),
  subject: z.string().nullable(),
  subjectCode: z.string().nullable(),
  description: z.string().nullable(),
  publisher: z.string().nullable(),
  date: z.string().nullable(),
  source: z.string().nullable(),
  language: z.string().nullable(),
  format: z.enum(['DAISY_V3', 'EPUB3']),
  storagePath: z.string(),
  coverImage: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  contentHash: z.string().nullable(),
  featured: z.boolean().default(false),
  hidden: z.boolean().default(false),
  views: z.number().default(0),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Book = z.infer<typeof BookSchema>;
