import { z } from 'zod';
import {
  S3UploadUrlRequestSchema,
  S3UploadUrlResponseSchema,
} from '@/src/schema';

export const fileRoutes = {
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
    },
    summary: 'Get a presigned URL for uploading a file',
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
    },
    summary: 'Abort multipart upload',
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
    },
    summary: 'Rename a file',
  },
} as const;
