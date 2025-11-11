import { z } from 'zod';

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

export type FileInfo = z.infer<typeof FileInfoSchema>;
export type FileContent = z.infer<typeof FileContentSchema>;
export type S3UploadUrlRequest = z.infer<typeof S3UploadUrlRequestSchema>;
export type S3UploadUrlResponse = z.infer<typeof S3UploadUrlResponseSchema>;
