import { z } from 'zod';
import { BookSchema } from '@/src/schema';

export const bookRoutes = {
  getAllBooks: {
    method: 'GET',
    path: '/api/books',
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      subject: z.string().optional(),
      author: z.string().optional(),
      search: z.string().optional(),
      sortBy: z.enum(['name', 'date']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      featured: z.coerce.boolean().optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
    summary: 'Get all books with optional filtering and pagination',
  },

  getFeaturedBooks: {
    method: 'GET',
    path: '/api/books/featured',
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      sortBy: z.enum(['name', 'date']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
    summary: 'Get featured books',
  },

  searchBooks: {
    method: 'GET',
    path: '/api/books/search',
    query: z.object({
      q: z.string().min(1),
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
    summary: 'Search books by query string',
  },

  getBookById: {
    method: 'GET',
    path: '/api/books/:bookId',
    responses: {
      200: BookSchema,
    },
    summary: 'Get a book by ID',
  },

  getBooksByLanguage: {
    method: 'GET',
    path: '/api/books/language/:language',
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
    summary: 'Get books by language',
  },

  getBookBySubject: {
    method: 'GET',
    path: '/api/books/subject/:subjectSlug',
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      sortBy: z.enum(['name', 'date']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
    summary: 'Get books by subject',
  },

  uploadBook: {
    method: 'POST',
    path: '/api/books',
    headers: z.object({
      authorization: z.string(),
    }),
    body: BookSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    responses: {
      201: BookSchema,
    },
    summary: 'Upload a new book',
  },

  editBook: {
    method: 'PATCH',
    path: '/api/books/:bookId',
    headers: z.object({
      authorization: z.string(),
    }),
    body: BookSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).partial(),
    responses: {
      200: BookSchema,
    },
    summary: 'Edit a book',
  },

  deleteBook: {
    method: 'DELETE',
    path: '/api/books/:bookId',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete a book',
  },
} as const;
