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

// Common query schemas
export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export const SortQuerySchema = z.object({
  sortBy: z.enum(['name', 'date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const BookFilterQuerySchema = PaginationQuerySchema.extend({
  subject: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
}).merge(SortQuerySchema);

export const SearchQuerySchema = z
  .object({
    q: z.string().min(1),
  })
  .merge(PaginationQuerySchema);

// Common response schemas
export const BookListResponseSchema = z.object({
  data: z.array(BookSchema),
  total: z.number(),
});

export const BookViewsResponseSchema = z.object({
  bookId: z.string(),
  views: z.number().int(),
});

// Type exports
export type Book = z.infer<typeof BookSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type SortQuery = z.infer<typeof SortQuerySchema>;
export type BookFilterQuery = z.infer<typeof BookFilterQuerySchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type BookListResponse = z.infer<typeof BookListResponseSchema>;
export type BookViewsResponse = z.infer<typeof BookViewsResponseSchema>;
