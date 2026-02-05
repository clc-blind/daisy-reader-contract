import { z } from 'zod';
import {
  BookFilterQuerySchema,
  BookListResponseSchema,
  BookSchema,
  BookViewsResponseSchema,
  CreateBookSchema,
  PaginationQuerySchema,
  SearchQuerySchema,
  SortQuerySchema,
  UpdateBookSchema,
} from '@/src/schema';

export const bookRoutes = {
  getAllBooks: {
    method: 'GET',
    path: '/api/books',
    query: BookFilterQuerySchema,
    responses: {
      200: BookListResponseSchema,
    },
    summary: 'Get all books with optional filtering and pagination',
  },

  getFeaturedBooks: {
    method: 'GET',
    path: '/api/books/featured',
    query: PaginationQuerySchema.merge(SortQuerySchema),
    responses: {
      200: BookListResponseSchema,
    },
    summary: 'Get featured books',
  },

  searchBooks: {
    method: 'GET',
    path: '/api/books/search',
    query: SearchQuerySchema,
    responses: {
      200: BookListResponseSchema,
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
    query: PaginationQuerySchema,
    responses: {
      200: BookListResponseSchema,
    },
    summary: 'Get books by language',
  },

  getBookBySubject: {
    method: 'GET',
    path: '/api/books/subject/:subjectSlug',
    query: PaginationQuerySchema.merge(SortQuerySchema),
    responses: {
      200: BookListResponseSchema,
    },
    summary: 'Get books by subject',
  },

  uploadBook: {
    method: 'POST',
    path: '/api/books',
    headers: z.object({
      authorization: z.string(),
    }),
    body: CreateBookSchema,
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
    body: UpdateBookSchema,
    responses: {
      200: BookSchema,
    },
    summary: 'Edit a book',
  },

  incrementBookViews: {
    method: 'POST',
    path: '/api/books/:bookId/views',
    pathParams: z.object({
      bookId: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: BookViewsResponseSchema,
    },
    summary: 'Increment view count for a book',
  },

  deleteBook: {
    method: 'DELETE',
    path: '/api/books/:bookId',
    headers: z.object({
      authorization: z.string(),
    }),
    pathParams: z.object({
      bookId: z.string(),
    }),
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete a book',
  },
} as const;
