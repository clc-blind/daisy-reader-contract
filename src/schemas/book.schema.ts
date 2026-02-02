import { z } from 'zod';

export const BookSchema = z
  .object({
    id: z.string().describe('Unique book identifier'),
    title: z.string().describe('Book title'),
    creator: z.string().nullable().describe('Book author/creator'),
    subject: z.string().nullable().describe('Book subject'),
    subjectCode: z.string().nullable().describe('Book subject code'),
    description: z.string().nullable().describe('Book description'),
    publisher: z.string().nullable().describe('Publisher name'),
    date: z.string().nullable().describe('Publication date'),
    source: z.string().nullable().describe('Book source'),
    language: z.string().nullable().describe('Book language code'),
    format: z.enum(['DAISY_V3', 'EPUB3']).describe('Book format'),
    storagePath: z.string().describe('File storage path'),
    coverImage: z.string().nullable().describe('Cover image URL'),
    durationSeconds: z
      .number()
      .nullable()
      .describe('Audio duration in seconds'),
    contentHash: z.string().nullable().describe('Content hash for integrity'),
    featured: z.boolean().default(false).describe('Whether book is featured'),
    hidden: z.boolean().default(false).describe('Whether book is hidden'),
    views: z.number().default(0).describe('Number of views'),
    tags: z.array(z.string()).default([]).describe('Book tags'),
    createdAt: z.date().describe('Creation timestamp'),
    updatedAt: z.date().describe('Last update timestamp'),
  })
  .describe('Book entity');

// Common query schemas
export const PaginationQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .optional()
      .describe('Maximum number of items to return'),
    offset: z.coerce.number().optional().describe('Number of items to skip'),
  })
  .describe('Pagination parameters');

export const SortQuerySchema = z
  .object({
    sortBy: z.enum(['name', 'date']).optional().describe('Field to sort by'),
    sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order'),
  })
  .describe('Sort parameters');

export const BookFilterQuerySchema = PaginationQuerySchema.merge(
  SortQuerySchema,
)
  .extend({
    subject: z.string().optional().describe('Filter by subject'),
    author: z.string().optional().describe('Filter by author'),
    search: z.string().optional().describe('Search query'),
    featured: z.coerce
      .boolean()
      .optional()
      .describe('Filter by featured status'),
  })
  .describe('Book filter and pagination query');

export const SearchQuerySchema = z
  .object({
    q: z.string().min(1).describe('Search query string'),
  })
  .merge(PaginationQuerySchema)
  .describe('Book search query with pagination');

// DTO schemas
export const CreateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).describe('Create book request body');

export const UpdateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .describe('Update book request body');

// Common response schemas
export const BookListResponseSchema = z
  .object({
    data: z.array(BookSchema).describe('List of books'),
    total: z.number().describe('Total number of books'),
  })
  .describe('Paginated book list response');

export const BookViewsResponseSchema = z
  .object({
    bookId: z.string().describe('Book ID'),
    views: z.number().int().describe('Number of views'),
  })
  .describe('Book views count response');

// Type exports
export type Book = z.infer<typeof BookSchema>;
export type CreateBook = z.infer<typeof CreateBookSchema>;
export type UpdateBook = z.infer<typeof UpdateBookSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type SortQuery = z.infer<typeof SortQuerySchema>;
export type BookFilterQuery = z.infer<typeof BookFilterQuerySchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type BookListResponse = z.infer<typeof BookListResponseSchema>;
export type BookViewsResponse = z.infer<typeof BookViewsResponseSchema>;
