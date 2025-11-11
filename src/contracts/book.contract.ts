import { z } from 'zod';
import { BookSchema } from '@/src/schema';

export const bookRoutes = {
  getAllBooks: {
    method: 'GET',
    path: '/books',
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
    path: '/books/featured',
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
    path: '/books/search',
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
    path: '/books/:bookId',
    responses: {
      200: BookSchema,
    },
    summary: 'Get a book by ID',
  },

  getBooksByLanguage: {
    method: 'GET',
    path: '/books/language/:language',
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
    path: '/books/subject/:subjectSlug',
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
    path: '/books',
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
    path: '/books/:bookId',
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
    path: '/books/:bookId',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete a book',
  },

  listBookFiles: {
    method: 'GET',
    path: '/books/:bookId/files',
    pathParams: z.object({ bookId: z.string() }),
    responses: {
      200: z.object({
        bookId: z.string(),
        bookTitle: z.string(),
        storagePath: z.string(),
        totalFiles: z.number().int(),
        files: z.array(
          z.object({
            key: z.string(),
            fileName: z.string(),
            extension: z.string(),
            contentType: z.string(),
          }),
        ),
      }),
    },
    summary: 'List all files for a book',
  },

  getBookFileContent: {
    method: 'GET',
    path: '/books/:bookId/files/:fileName',
    pathParams: z.object({ bookId: z.string(), fileName: z.string() }),
    query: z.object({
      encoding: z.enum(['utf-8', 'base64']).default('utf-8'),
    }),
    responses: {
      200: z.object({
        bookId: z.string(),
        fileName: z.string(),
        contentType: z.string(),
        encoding: z.enum(['utf-8', 'base64']),
        size: z.number().int(),
        content: z.string(),
      }),
    },
    summary: 'Get file content for a book',
  },

  getBookAudioSignedUrl: {
    method: 'GET',
    path: '/books/:bookId/audio/:fileName/signed-url',
    pathParams: z.object({ bookId: z.string(), fileName: z.string() }),
    query: z.object({
      expiresIn: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({ url: z.string().url() }),
    },
    summary: 'Get presigned URL for book audio file',
  },
} as const;
