import { z } from 'zod';

// User (Better Auth)
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Account (Better Auth)
export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  idToken: z.string().nullable().optional(),
  accessTokenExpiresAt: z.date().nullable().optional(),
  refreshTokenExpiresAt: z.date().nullable().optional(),
  scope: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Session (Better Auth)
export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  userId: z.string(),
});

// Book
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

// ReadingProgress
export const ReadingProgressSchema = z.object({
  id: z.string(),
  userId: z.string(), // Changed from accountId to userId
  bookId: z.string(),
  currentTimeSeconds: z.number(),
  currentPosition: z.string().nullable(),
  isCompleted: z.boolean(),
  lastReadAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Mark
export const MarkSchema = z.object({
  id: z.string(),
  userId: z.string(), // Changed from accountId to userId
  bookId: z.string(),
  type: z.enum(['highlight', 'note', 'bookmark']),
  title: z.string(),
  selectedText: z.string().nullable(),
  contextBefore: z.string().nullable(),
  contextAfter: z.string().nullable(),
  chapterId: z.string().nullable(),
  audioTimeSeconds: z.number().nullable(),
  textPosition: z.string().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable(),
  content: z.string().nullable(),
  isOrphan: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// AccountPreferences
export const AccountPreferencesSchema = z.object({
  userId: z.string(),
  theme: z.string(),
  fontSize: z.number().default(16),
  defaultSpeed: z.number().default(1.0),
  autoBookmark: z.boolean().default(true),
  updatedAt: z.date(),
});

export const FileInfoSchema = z.object({
  key: z.string(), // S3 key (full path)
  fileName: z.string(), // just file name
  extension: z.string(), // file extension, e.g. "xml", "html"
  contentType: z.string(), // MIME type
});

export const FileContentSchema = z.object({
  bookId: z.string(),
  fileName: z.string(),
  contentType: z.string(),
  encoding: z.enum(['utf-8', 'base64']),
  size: z.number().int(), // bytes
  content: z.string(), // text (utf-8) or base64 string
});

export const S3UploadUrlRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  fileSize: z.number().int().optional(),
});

export const S3UploadUrlResponseSchema = z.object({
  uploadUrl: z.string().url(),
  fileKey: z.string(),
  expiresIn: z.number().int(),
});

export type User = z.infer<typeof UserSchema>;
export type Account = z.infer<typeof AccountSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Book = z.infer<typeof BookSchema>;
export type ReadingProgress = z.infer<typeof ReadingProgressSchema>;
export type Mark = z.infer<typeof MarkSchema>;
export type AccountPreferences = z.infer<typeof AccountPreferencesSchema>;
export type FileInfo = z.infer<typeof FileInfoSchema>;
export type FileContent = z.infer<typeof FileContentSchema>;
export type S3UploadUrlRequest = z.infer<typeof S3UploadUrlRequestSchema>;
export type S3UploadUrlResponse = z.infer<typeof S3UploadUrlResponseSchema>;
