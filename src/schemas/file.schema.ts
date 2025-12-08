import { z } from 'zod';

// Base file metadata schema
export const FileMetadataSchema = z.object({
  fileKey: z.string(),
  contentType: z.string().optional(),
  contentEncoding: z.string().optional(),
  contentLength: z.number().int().optional(),
  lastModified: z.date().optional(),
  eTag: z.string().optional(),
});

// List files response item
export const FileListItemSchema = z.object({
  fileName: z.string(),
  fileKey: z.string(),
  contentType: z.string().optional(),
  contentEncoding: z.string().optional(),
  contentLength: z.number().int().optional(),
  lastModified: z.date().optional(),
  eTag: z.string().optional(),
});

// File content response
export const FileContentResponseSchema = z.object({
  bookId: z.string(),
  fileName: z.string(),
  storagePath: z.string(),
  fileKey: z.string(),
  contentType: z.string().optional(),
  contentEncoding: z.string().optional(),
  contentLength: z.number().int().optional(),
  content: z.string(),
  lastModified: z.date().optional(),
  eTag: z.string().optional(),
});

// Signed URL response
export const SignedUrlResponseSchema = z.object({
  fileKey: z.string(),
  url: z.string().url(),
});

// File exists response
export const FileExistsResponseSchema = z.object({
  fileKey: z.string(),
  exists: z.boolean(),
});

// Folder exists response
export const FolderExistsResponseSchema = z.object({
  exists: z.boolean(),
  keyCount: z.number().int().optional(),
});

// Upload URL request/response
export const UploadUrlRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string().optional(),
  fileSize: z.number().int().optional(),
});

export const UploadUrlResponseSchema = z.object({
  uploadUrl: z.string().url(),
  fileKey: z.string(),
  expiresIn: z.number().int(),
});

// Direct upload request/response
export const DirectUploadRequestSchema = z.object({
  fileKey: z.string(),
  contentType: z.string().optional(),
  content: z.string(),
});

export const DirectUploadResponseSchema = z.object({
  url: z.string().url(),
  contentLength: z.number().int().optional(),
  fileKey: z.string(),
  expiresIn: z.number().int(),
  eTag: z.string().optional(),
});

// Multipart upload schemas
export const InitiateMultipartRequestSchema = z.object({
  fileKey: z.string(),
  contentType: z.string().optional(),
  fileSize: z.number().int(),
});

export const InitiateMultipartResponseSchema = z.object({
  uploadId: z.string().optional(),
  fileKey: z.string(),
  bucket: z.string(),
});

export const UploadPartRequestSchema = z.object({
  uploadId: z.string(),
  fileKey: z.string(),
  partNumber: z.number().int().min(1).max(10000),
});

export const UploadPartResponseSchema = z.object({
  fileKey: z.string(),
  url: z.string().url(),
  partNumber: z.number().int(),
});

export const MultipartPartSchema = z.object({
  fileKey: z.string(),
  partNumber: z.number().int(),
  eTag: z.string().optional(),
});

export const CompleteMultipartRequestSchema = z.object({
  uploadId: z.string(),
  fileKey: z.string(),
  parts: z.array(MultipartPartSchema),
});

export const CompleteMultipartResponseSchema = z.object({
  bucket: z.string(),
  fileKey: z.string(),
  eTag: z.string().optional(),
});

export const AbortMultipartRequestSchema = z.object({
  uploadId: z.string(),
  fileKey: z.string(),
});

export const MultipartUploadItemSchema = z.object({
  fileKey: z.string(),
  uploadId: z.string().optional(),
  initiated: z.date().optional(),
  storageClass: z.string().optional(),
});

export const ListMultipartUploadsResponseSchema = z.object({
  uploads: z.array(MultipartUploadItemSchema),
  isTruncated: z.boolean().optional(),
  nextKeyMarker: z.string().optional(),
  nextUploadIdMarker: z.string().optional(),
  prefix: z.string().optional(),
});

// Delete operations
export const BatchDeleteRequestSchema = z.object({
  fileKeys: z.array(z.string()).min(1).max(1000),
  quiet: z.boolean().optional(),
});

export const DeletedFileSchema = z.object({
  fileKey: z.string(),
  deleteMarker: z.boolean().optional(),
});

export const DeleteErrorSchema = z.object({
  fileKey: z.string().optional(),
  code: z.string().optional(),
  message: z.string().optional(),
});

export const BatchDeleteResponseSchema = z.object({
  deleted: z.array(DeletedFileSchema),
  errors: z.array(DeleteErrorSchema).optional(),
});

export const DeleteFileResponseSchema = z.object({
  deleteMarker: z.boolean().optional(),
});

// Copy/Move/Rename operations
export const CopyFileRequestSchema = z.object({
  sourceFileKey: z.string(),
  destinationFileKey: z.string(),
});

export const CopyObjectResultSchema = z.object({
  eTag: z.string().optional(),
  lastModified: z.date().optional(),
});

export const CopyFileResponseSchema = z.object({
  copyObjectResult: CopyObjectResultSchema,
  copySourceVersionId: z.string().optional(),
});

export const RenameFileRequestSchema = z.object({
  fileKey: z.string(),
  newFileName: z.string(),
});

export const MoveFileRequestSchema = z.object({
  sourceFileKey: z.string(),
  destinationFileKey: z.string(),
});

export const MoveFileResponseSchema = z.object({
  copyResponse: z.object({
    copyObjectResult: CopyObjectResultSchema.optional(),
    copySourceVersionId: z.string().optional(),
  }),
  deleteResponse: z.object({
    deleteMarker: z.boolean().optional(),
  }),
});

// List files response
export const ListFilesResponseSchema = z.object({
  contents: z.array(FileListItemSchema),
  isTruncated: z.boolean().optional(),
  nextContinuationToken: z.string().optional(),
  keyCount: z.number().int().optional(),
  prefix: z.string().optional(),
  maxKeys: z.number().int().optional(),
});

// Book files list response
export const BookFilesListResponseSchema = z.object({
  bookId: z.string(),
  bookTitle: z.string(),
  storagePath: z.string(),
  totalFiles: z.number().int(),
  files: z.array(FileListItemSchema),
});

// Error response
export const FileErrorResponseSchema = z.object({
  message: z.string(),
});

// Type exports
export type FileMetadata = z.infer<typeof FileMetadataSchema>;
export type FileListItem = z.infer<typeof FileListItemSchema>;
export type FileContentResponse = z.infer<typeof FileContentResponseSchema>;
export type SignedUrlResponse = z.infer<typeof SignedUrlResponseSchema>;
export type FileExistsResponse = z.infer<typeof FileExistsResponseSchema>;
export type FolderExistsResponse = z.infer<typeof FolderExistsResponseSchema>;
export type UploadUrlRequest = z.infer<typeof UploadUrlRequestSchema>;
export type UploadUrlResponse = z.infer<typeof UploadUrlResponseSchema>;
export type DirectUploadRequest = z.infer<typeof DirectUploadRequestSchema>;
export type DirectUploadResponse = z.infer<typeof DirectUploadResponseSchema>;
export type InitiateMultipartRequest = z.infer<
  typeof InitiateMultipartRequestSchema
>;
export type InitiateMultipartResponse = z.infer<
  typeof InitiateMultipartResponseSchema
>;
export type UploadPartRequest = z.infer<typeof UploadPartRequestSchema>;
export type UploadPartResponse = z.infer<typeof UploadPartResponseSchema>;
export type MultipartPart = z.infer<typeof MultipartPartSchema>;
export type CompleteMultipartRequest = z.infer<
  typeof CompleteMultipartRequestSchema
>;
export type CompleteMultipartResponse = z.infer<
  typeof CompleteMultipartResponseSchema
>;
export type AbortMultipartRequest = z.infer<typeof AbortMultipartRequestSchema>;
export type MultipartUploadItem = z.infer<typeof MultipartUploadItemSchema>;
export type ListMultipartUploadsResponse = z.infer<
  typeof ListMultipartUploadsResponseSchema
>;
export type BatchDeleteRequest = z.infer<typeof BatchDeleteRequestSchema>;
export type DeletedFile = z.infer<typeof DeletedFileSchema>;
export type DeleteError = z.infer<typeof DeleteErrorSchema>;
export type BatchDeleteResponse = z.infer<typeof BatchDeleteResponseSchema>;
export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;
export type CopyFileRequest = z.infer<typeof CopyFileRequestSchema>;
export type CopyObjectResult = z.infer<typeof CopyObjectResultSchema>;
export type CopyFileResponse = z.infer<typeof CopyFileResponseSchema>;
export type RenameFileRequest = z.infer<typeof RenameFileRequestSchema>;
export type MoveFileRequest = z.infer<typeof MoveFileRequestSchema>;
export type MoveFileResponse = z.infer<typeof MoveFileResponseSchema>;
export type ListFilesResponse = z.infer<typeof ListFilesResponseSchema>;
export type BookFilesListResponse = z.infer<typeof BookFilesListResponseSchema>;
export type FileErrorResponse = z.infer<typeof FileErrorResponseSchema>;
