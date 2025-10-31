import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AccountSchema,
  BookSchema,
  FileContentSchema,
  FileInfoSchema,
  MarkSchema,
  ReadingProgressSchema,
} from '@/src/schema';

const c = initContract();

export const appContract = c.router({
  // Books
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
  },

  getBookById: {
    method: 'GET',
    path: '/books/:id',
    responses: {
      200: BookSchema,
    },
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
  },

  uploadBook: {
    method: 'POST',
    path: '/books',
    body: BookSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    responses: {
      201: BookSchema,
    },
  },

  // Accounts
  createAccount: {
    method: 'POST',
    path: '/accounts',
    body: AccountSchema.omit({ id: true, createdAt: true }),
    responses: {
      201: AccountSchema,
    },
  },

  getAccountById: {
    method: 'GET',
    path: '/accounts/:id',
    responses: {
      200: AccountSchema,
    },
  },

  // Reading progress
  getRecentlyReadBooks: {
    method: 'GET',
    path: '/progress/recent/:accountId',
    query: z.object({ limit: z.coerce.number().optional() }),
    responses: {
      200: z.array(BookSchema),
    },
  },

  getInprogressBooks: {
    method: 'GET',
    path: '/progress/inprogress/:accountId',
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
  },

  updateReadingProgress: {
    method: 'PATCH',
    path: '/progress/:id',
    body: ReadingProgressSchema.omit({
      id: true,
    }).partial({
      currentPosition: true,
      currentTimeSeconds: true,
      isCompleted: true,
      updatedAt: true,
      createdAt: true,
    }),
    responses: {
      200: ReadingProgressSchema.partial({
        currentPosition: true,
      }),
    },
  },

  // Marks
  createMark: {
    method: 'POST',
    path: '/marks',
    body: MarkSchema.omit({ createdAt: true, updatedAt: true }),
    responses: {
      201: MarkSchema,
    },
  },

  getMarksByBook: {
    method: 'GET',
    path: '/marks/:accountId/:bookId',
    responses: {
      200: z.array(MarkSchema),
    },
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
        files: z.array(FileInfoSchema),
      }),
    },
  },

  // Get file content for a given book/fileName
  getBookFileContent: {
    method: 'GET',
    path: '/books/:bookId/files/:fileName',
    pathParams: z.object({ bookId: z.string(), fileName: z.string() }),
    query: z.object({
      encoding: z.enum(['utf-8', 'base64']).default('utf-8'),
    }),
    responses: {
      200: FileContentSchema,
    },
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
  },

  getSignedGetUrl: {
    method: 'GET',
    path: '/files/signed-url',
    query: z.object({
      fileKey: z.string(),
      expiresIn: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({ url: z.string().url() }),
    },
  },
});
