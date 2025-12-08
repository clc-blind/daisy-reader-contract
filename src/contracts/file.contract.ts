import { z } from 'zod';
import {
  AbortMultipartRequestSchema,
  BatchDeleteRequestSchema,
  BatchDeleteResponseSchema,
  BookFilesListResponseSchema,
  CompleteMultipartRequestSchema,
  CompleteMultipartResponseSchema,
  CopyFileRequestSchema,
  CopyFileResponseSchema,
  DeleteFileResponseSchema,
  DirectUploadRequestSchema,
  DirectUploadResponseSchema,
  FileContentResponseSchema,
  FileErrorResponseSchema,
  FileExistsResponseSchema,
  FileMetadataSchema,
  FolderExistsResponseSchema,
  InitiateMultipartRequestSchema,
  InitiateMultipartResponseSchema,
  ListFilesResponseSchema,
  ListMultipartUploadsResponseSchema,
  MoveFileRequestSchema,
  MoveFileResponseSchema,
  RenameFileRequestSchema,
  SignedUrlResponseSchema,
  UploadPartRequestSchema,
  UploadPartResponseSchema,
  UploadUrlRequestSchema,
  UploadUrlResponseSchema,
} from '@/src/schema';

export const fileRoutes = {
  listBookFiles: {
    method: 'GET',
    path: '/api/books/:bookId/files',
    pathParams: z.object({ bookId: z.string() }),
    responses: {
      200: BookFilesListResponseSchema,
    },
    summary: 'List all files for a book',
  },

  getBookFileContent: {
    method: 'GET',
    path: '/api/books/:bookId/files/:fileName',
    pathParams: z.object({ bookId: z.string(), fileName: z.string() }),
    query: z.object({
      expiresIn: z.coerce.number().optional(),
    }),
    responses: {
      200: FileContentResponseSchema,
    },
    summary: 'Get file content for a book',
  },

  getBookAudioSignedUrl: {
    method: 'GET',
    path: '/api/books/:bookId/audio/:fileName/signed-url',
    pathParams: z.object({ bookId: z.string(), fileName: z.string() }),
    query: z.object({
      expiresIn: z.coerce.number().optional(),
    }),
    responses: {
      200: SignedUrlResponseSchema,
    },
    summary: 'Get presigned URL for book audio file',
  },

  listFiles: {
    method: 'GET',
    path: '/api/files/list',
    headers: z.object({
      authorization: z.string(),
    }),
    query: z.object({
      storagePath: z.string(),
      prefix: z.string().optional(),
      continuationToken: z.string().optional(),
      maxKeys: z.coerce.number().int().min(1).optional(),
    }),
    responses: {
      200: ListFilesResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'List files in a storage path with pagination support',
  },

  getSignedGetUrl: {
    method: 'GET',
    path: '/api/files/signed-url',
    query: z.object({
      fileKey: z.string(),
      expiresIn: z.coerce.number().optional(),
    }),
    responses: {
      200: SignedUrlResponseSchema,
    },
    summary: 'Get presigned URL for downloading a file',
  },

  getFileMetadata: {
    method: 'GET',
    path: '/api/files/metadata',
    headers: z.object({
      authorization: z.string(),
    }),
    query: z.object({
      fileKey: z.string(),
    }),
    responses: {
      200: FileMetadataSchema,
      401: FileErrorResponseSchema,
      404: FileErrorResponseSchema,
    },
    summary: 'Get object metadata for a file',
  },

  checkFileExists: {
    method: 'GET',
    path: '/api/files/exists',
    headers: z.object({
      authorization: z.string(),
    }),
    query: z.object({
      fileKey: z.string(),
    }),
    responses: {
      200: FileExistsResponseSchema,
      401: FileErrorResponseSchema,
      404: FileErrorResponseSchema,
    },
    summary: 'Check whether a file exists',
  },

  checkFolderExists: {
    method: 'GET',
    path: '/api/files/folder/exists',
    headers: z.object({
      authorization: z.string(),
    }),
    query: z.object({
      folderKey: z.string(),
    }),
    responses: {
      200: FolderExistsResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary:
      'Check whether a folder (prefix) exists and optionally count objects',
  },

  requestFileUploadUrl: {
    method: 'POST',
    path: '/api/files/upload-url',
    headers: z.object({
      authorization: z.string(),
    }),
    body: UploadUrlRequestSchema,
    responses: {
      200: UploadUrlResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Get a presigned URL for uploading a file',
  },

  uploadFile: {
    method: 'PUT',
    path: '/api/files/upload',
    headers: z.object({
      authorization: z.string(),
      'content-type': z.string(),
    }),
    body: DirectUploadRequestSchema,
    responses: {
      200: DirectUploadResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Upload a file directly using S3 PutObject',
  },

  initiateMultipartUpload: {
    method: 'POST',
    path: '/api/files/multipart/initiate',
    headers: z.object({
      authorization: z.string(),
    }),
    body: InitiateMultipartRequestSchema,
    responses: {
      200: InitiateMultipartResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Initiate multipart upload for large files',
  },

  getUploadPartUrl: {
    method: 'POST',
    path: '/api/files/multipart/part-url',
    headers: z.object({
      authorization: z.string(),
    }),
    body: UploadPartRequestSchema,
    responses: {
      200: UploadPartResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Get presigned URL for uploading a part',
  },

  completeMultipartUpload: {
    method: 'POST',
    path: '/api/files/multipart/complete',
    headers: z.object({
      authorization: z.string(),
    }),
    body: CompleteMultipartRequestSchema,
    responses: {
      200: CompleteMultipartResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Complete multipart upload',
  },

  abortMultipartUpload: {
    method: 'POST',
    path: '/api/files/multipart/abort',
    headers: z.object({
      authorization: z.string(),
    }),
    body: AbortMultipartRequestSchema,
    responses: {
      200: z.object({}),
      401: FileErrorResponseSchema,
    },
    summary: 'Abort multipart upload',
  },

  listMultipartUploads: {
    method: 'GET',
    path: '/api/files/multipart/list',
    headers: z.object({
      authorization: z.string(),
    }),
    query: z.object({
      prefix: z.string().optional(),
      keyMarker: z.string().optional(),
      uploadIdMarker: z.string().optional(),
      maxUploads: z.coerce.number().int().min(1).max(1000).optional(),
    }),
    responses: {
      200: ListMultipartUploadsResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'List in-progress multipart uploads',
  },

  deleteFiles: {
    method: 'POST',
    path: '/api/files/batch-delete',
    headers: z.object({
      authorization: z.string(),
    }),
    body: BatchDeleteRequestSchema,
    responses: {
      200: BatchDeleteResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Delete multiple files in a single request',
  },

  deleteFile: {
    method: 'DELETE',
    path: '/api/files/delete',
    headers: z.object({
      authorization: z.string(),
    }),
    query: z.object({
      fileKey: z.string(),
    }),
    body: z.undefined(),
    responses: {
      200: DeleteFileResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Delete a file',
  },

  copyFile: {
    method: 'POST',
    path: '/api/files/copy',
    headers: z.object({
      authorization: z.string(),
    }),
    body: CopyFileRequestSchema,
    responses: {
      200: CopyFileResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Copy a file',
  },

  renameFile: {
    method: 'POST',
    path: '/api/files/rename',
    headers: z.object({
      authorization: z.string(),
    }),
    body: RenameFileRequestSchema,
    responses: {
      200: CopyFileResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Rename a file',
  },

  moveFile: {
    method: 'POST',
    path: '/api/files/move',
    headers: z.object({
      authorization: z.string(),
    }),
    body: MoveFileRequestSchema,
    responses: {
      200: MoveFileResponseSchema,
      401: FileErrorResponseSchema,
    },
    summary: 'Move a file (copy to destination and delete source)',
  },
} as const;
