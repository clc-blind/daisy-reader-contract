import { z } from 'zod';
import {
  S3UploadUrlRequestSchema,
  S3UploadUrlResponseSchema,
} from '@/src/schema';

export const fileRoutes = {
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
      maxKeys: z.coerce.number().int().min(1).max(1000).optional(),
    }),
    responses: {
      200: z.object({
        contents: z.array(
          z.object({
            key: z.string(),
            lastModified: z.string().datetime(),
            eTag: z.string(),
            size: z.number().int(),
            storageClass: z.string().optional(),
          }),
        ),
        isTruncated: z.boolean(),
        nextContinuationToken: z.string().optional(),
        keyCount: z.number().int(),
      }),
      401: z.object({
        message: z.string(),
      }),
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
      200: z.object({ url: z.string().url() }),
    },
    summary: 'Get presigned URL for downloading a file',
  },

  requestFileUploadUrl: {
    method: 'POST',
    path: '/api/files/upload-url',
    headers: z.object({
      authorization: z.string(),
    }),
    body: S3UploadUrlRequestSchema,
    responses: {
      200: S3UploadUrlResponseSchema,
      401: z.object({
        message: z.string(),
      }),
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
    body: z.object({
      fileName: z.string(),
      storagePath: z.string(),
      contentType: z.string(),
      content: z.string(), // Base64 encoded file content
    }),
    responses: {
      200: z.object({
        fileKey: z.string(),
        url: z.string().url(),
        size: z.number().int(),
        etag: z.string(),
      }),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Upload a file directly using S3 PutObject',
  },

  initiateMultipartUpload: {
    method: 'POST',
    path: '/api/files/multipart/initiate',
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
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Initiate multipart upload for large files',
  },

  getUploadPartUrl: {
    method: 'POST',
    path: '/api/files/multipart/part-url',
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
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Get presigned URL for uploading a part',
  },

  completeMultipartUpload: {
    method: 'POST',
    path: '/api/files/multipart/complete',
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
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Complete multipart upload',
  },

  abortMultipartUpload: {
    method: 'POST',
    path: '/api/files/multipart/abort',
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
      401: z.object({
        message: z.string(),
      }),
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
      200: z.object({
        uploads: z.array(
          z.object({
            key: z.string(),
            uploadId: z.string(),
            initiated: z.string().datetime(),
            storageClass: z.string().optional(),
          }),
        ),
        isTruncated: z.boolean(),
        nextKeyMarker: z.string().optional(),
        nextUploadIdMarker: z.string().optional(),
      }),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'List in-progress multipart uploads',
  },

  deleteFiles: {
    method: 'POST',
    path: '/api/files/batch-delete',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      keys: z.array(z.string()).min(1).max(1000),
      quiet: z.boolean().optional(),
    }),
    responses: {
      200: z.object({
        deleted: z.array(
          z.object({
            key: z.string(),
            versionId: z.string().optional(),
          }),
        ),
        errors: z
          .array(
            z.object({
              key: z.string(),
              code: z.string(),
              message: z.string(),
            }),
          )
          .optional(),
      }),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Delete multiple files in a single request',
  },

  deleteFile: {
    method: 'DELETE',
    path: '/api/files/:fileKey',
    headers: z.object({
      authorization: z.string(),
    }),
    pathParams: z.object({
      fileKey: z.string(),
    }),
    body: z.undefined(),
    responses: {
      204: z.undefined(),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Delete a file',
  },

  copyFile: {
    method: 'POST',
    path: '/api/files/:fileKey/copy',
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
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Copy a file',
  },

  renameFile: {
    method: 'POST',
    path: '/api/files/:fileKey/rename',
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
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Rename a file',
  },

  moveFile: {
    method: 'POST',
    path: '/api/files/:fileKey/move',
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
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Move a file (copy to destination and delete source)',
  },
} as const;
