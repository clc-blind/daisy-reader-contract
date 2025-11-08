import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  BookSchema,
  FileContentSchema,
  FileInfoSchema,
  MarkSchema,
  ReadingProgressSchema,
  S3UploadUrlRequestSchema,
  S3UploadUrlResponseSchema,
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
    path: '/books/:id',
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
    path: '/books/:id',
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
    path: '/books/:id',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete a book',
  },

  // Reading progress
  getRecentlyReadBooks: {
    method: 'GET',
    path: '/progress/recent/:userId',
    query: z.object({ limit: z.coerce.number().optional() }),
    responses: {
      200: z.array(BookSchema),
    },
    summary: 'Get recently read books for a user',
  },

  getInprogressBooks: {
    method: 'GET',
    path: '/progress/inprogress/:userId',
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({ data: z.array(BookSchema), total: z.number() }),
    },
    summary: 'Get in-progress books for a user',
  },

  updateReadingProgress: {
    method: 'PATCH',
    path: '/progress/:id',
    headers: z.object({
      authorization: z.string(),
    }),
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
    summary: 'Update reading progress',
  },

  // Marks
  createMark: {
    method: 'POST',
    path: '/marks',
    headers: z.object({
      authorization: z.string(),
    }),
    body: MarkSchema.omit({ createdAt: true, updatedAt: true }),
    responses: {
      201: MarkSchema,
    },
    summary: 'Create a new mark (highlight, note)',
  },

  getMarksByBook: {
    method: 'GET',
    path: '/marks/:userId/:bookId',
    responses: {
      200: z.array(MarkSchema),
    },
    summary: 'Get all marks for a book by a user',
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
    summary: 'List all files for a book',
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
    summary: 'Get presigned URL for downloading a file',
  },

  // File Upload Operations
  requestFileUploadUrl: {
    method: 'POST',
    path: '/files/upload-url',
    headers: z.object({
      authorization: z.string(),
    }),
    body: S3UploadUrlRequestSchema,
    responses: {
      200: S3UploadUrlResponseSchema,
    },
    summary: 'Get a presigned URL for uploading a file',
  },

  // Multipart Upload for Large Files
  initiateMultipartUpload: {
    method: 'POST',
    path: '/files/multipart/initiate',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      fileName: z.string(),
      contentType: z.string(),
      fileSize: z.number().int(),
    }),
    responses: {
      200: z.object({
        uploadId: z.string(),
        fileKey: z.string(),
      }),
    },
    summary: 'Initiate multipart upload for large files',
  },

  getUploadPartUrl: {
    method: 'POST',
    path: '/files/multipart/part-url',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      uploadId: z.string(),
      fileKey: z.string(),
      partNumber: z.number().int().min(1).max(10000),
    }),
    responses: {
      200: z.object({
        url: z.string().url(),
        partNumber: z.number().int(),
      }),
    },
    summary: 'Get presigned URL for uploading a part',
  },

  completeMultipartUpload: {
    method: 'POST',
    path: '/files/multipart/complete',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      uploadId: z.string(),
      fileKey: z.string(),
      parts: z.array(
        z.object({
          partNumber: z.number().int(),
          etag: z.string(),
        }),
      ),
    }),
    responses: {
      200: z.object({
        fileKey: z.string(),
        success: z.boolean(),
      }),
    },
    summary: 'Complete multipart upload',
  },

  abortMultipartUpload: {
    method: 'POST',
    path: '/files/multipart/abort',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      uploadId: z.string(),
      fileKey: z.string(),
    }),
    responses: {
      200: z.object({
        success: z.boolean(),
      }),
    },
    summary: 'Abort multipart upload',
  },

  // File Management
  deleteFile: {
    method: 'DELETE',
    path: '/files/:fileKey',
    headers: z.object({
      authorization: z.string(),
    }),
    pathParams: z.object({
      fileKey: z.string(),
    }),
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete a file',
  },

  copyFile: {
    method: 'POST',
    path: '/files/:fileKey/copy',
    headers: z.object({
      authorization: z.string(),
    }),
    pathParams: z.object({
      fileKey: z.string(),
    }),
    body: z.object({
      destinationKey: z.string(),
    }),
    responses: {
      200: z.object({
        sourceKey: z.string(),
        destinationKey: z.string(),
        success: z.boolean(),
      }),
    },
    summary: 'Copy a file',
  },

  renameFile: {
    method: 'POST',
    path: '/files/:fileKey/rename',
    headers: z.object({
      authorization: z.string(),
    }),
    pathParams: z.object({
      fileKey: z.string(),
    }),
    body: z.object({
      newFileName: z.string(),
    }),
    responses: {
      200: z.object({
        oldKey: z.string(),
        newKey: z.string(),
        success: z.boolean(),
      }),
    },
    summary: 'Rename a file',
  },
});
