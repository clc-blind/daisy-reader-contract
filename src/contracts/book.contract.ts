import { oc } from '@orpc/contract';
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

const authHeaderSchema = z.object({
  authorization: z.string(),
});

const o = oc.$route({ inputStructure: 'detailed', tags: ['Books'] });

export const bookRoutes = {
  getAllBooks: o
    .route({
      method: 'GET',
      path: '/api/books',
      summary: 'Get all books with optional filtering and pagination',
    })
    .input(
      z.object({
        query: BookFilterQuerySchema,
      }),
    )
    .output(BookListResponseSchema),

  getFeaturedBooks: o
    .route({
      method: 'GET',
      path: '/api/books/featured',
      summary: 'Get featured books',
    })
    .input(
      z.object({
        query: PaginationQuerySchema.merge(SortQuerySchema),
      }),
    )
    .output(BookListResponseSchema),

  searchBooks: o
    .route({
      method: 'GET',
      path: '/api/books/search',
      summary: 'Search books by query string',
    })
    .input(
      z.object({
        query: SearchQuerySchema,
      }),
    )
    .output(BookListResponseSchema),

  getBookById: o
    .route({
      method: 'GET',
      path: '/api/books/{bookId}',
      summary: 'Get a book by ID',
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
        }),
      }),
    )
    .output(BookSchema),

  getBooksByLanguage: o
    .route({
      method: 'GET',
      path: '/api/books/language/{language}',
      summary: 'Get books by language',
    })
    .input(
      z.object({
        params: z.object({
          language: z.string(),
        }),
        query: PaginationQuerySchema,
      }),
    )
    .output(BookListResponseSchema),

  getBookBySubject: o
    .route({
      method: 'GET',
      path: '/api/books/subject/{subjectSlug}',
      summary: 'Get books by subject',
    })
    .input(
      z.object({
        params: z.object({
          subjectSlug: z.string(),
        }),
        query: PaginationQuerySchema.merge(SortQuerySchema),
      }),
    )
    .output(BookListResponseSchema),

  uploadBook: o
    .route({
      method: 'POST',
      path: '/api/books',
      summary: 'Upload a new book',
      successStatus: 201,
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: CreateBookSchema,
      }),
    )
    .output(BookSchema),

  editBook: o
    .route({
      method: 'PATCH',
      path: '/api/books/{bookId}',
      summary: 'Edit a book',
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
        }),
        headers: authHeaderSchema,
        body: UpdateBookSchema,
      }),
    )
    .output(BookSchema),

  incrementBookViews: o
    .route({
      method: 'POST',
      path: '/api/books/{bookId}/views',
      summary: 'Increment view count for a book',
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
        }),
        body: z.object({}),
      }),
    )
    .output(BookViewsResponseSchema),

  deleteBook: o
    .route({
      method: 'DELETE',
      path: '/api/books/{bookId}',
      summary: 'Delete a book',
      successStatus: 204,
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
        }),
        headers: authHeaderSchema,
      }),
    )
    .output(z.void()),
} as const;
