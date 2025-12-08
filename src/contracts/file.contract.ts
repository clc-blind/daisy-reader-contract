import { z } from 'zod';

export const fileRoutes = {
  listBookFiles: {
    method: 'GET',
    path: '/api/books/:bookId/files',
    pathParams: z.object({ bookId: z.string() }),
    responses: {
      200: z.object({
        bookId: z.string(),
        bookTitle: z.string(),
        storagePath: z.string(),
        totalFiles: z.number().int(),
        files: z.array(
          z.object({
            fileName: z.string(),
            fileKey: z.string(),
            contentType: z.string().optional(),
            contentEncoding: z.string().optional(),
            contentLength: z.number().int().optional(),
            lastModified: z.date().optional(),
            eTag: z.string().optional(),
          }),
        ),
      }),
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
      200: z.object({
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
      }),
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
      200: z.object({
        fileKey: z.string(),
        url: z.string().url(),
      }),
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
      200: z.object({
        contents: z.array(
          z.object({
            fileKey: z.string(),
            contentType: z.string().optional(),
            contentEncoding: z.string().optional(),
            contentLength: z.number().int().optional(),
            lastModified: z.date().optional(),
            eTag: z.string().optional(),
          }),
        ),
        isTruncated: z.boolean().optional(),
        nextContinuationToken: z.string().optional(),
        keyCount: z.number().int().optional(),
        prefix: z.string().optional(),
        maxKeys: z.number().int().optional(),
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
      200: z.object({
        fileKey: z.string(),
        url: z.string().url(),
      }),
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
      200: z.object({
        fileKey: z.string(),
        contentType: z.string().optional(),
        contentEncoding: z.string().optional(),
        contentLength: z.number().int().optional(),
        lastModified: z.date().optional(),
        eTag: z.string().optional(),
      }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
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
      200: z.object({
        fileKey: z.string(),
        exists: z.boolean(),
      }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
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
      200: z.object({
        exists: z.boolean(),
        keyCount: z.number().int().optional(),
      }),
      401: z.object({ message: z.string() }),
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
    body: z.object({
      fileName: z.string(),
      contentType: z.string().optional(),
      fileSize: z.number().int().optional(),
    }),
    responses: {
      200: z.object({
        uploadUrl: z.string().url(),
        fileKey: z.string(),
        expiresIn: z.number().int(),
      }),
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
      fileKey: z.string(),
      contentType: z.string().optional(),
      content: z.string(), // Base64 encoded file content
    }),
    responses: {
      200: z.object({
        url: z.string().url(),
        contentLength: z.number().int().optional(),
        fileKey: z.string(),
        expiresIn: z.number().int(),
        eTag: z.string().optional(),
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
      fileKey: z.string(),
      contentType: z.string().optional(),
      fileSize: z.number().int(),
    }),
    responses: {
      200: z.object({
        uploadId: z.string().optional(),
        fileKey: z.string(),
        bucket: z.string(),
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
        fileKey: z.string(),
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
          fileKey: z.string(),
          partNumber: z.number().int(),
          eTag: z.string().optional(),
        }),
      ),
    }),
    responses: {
      200: z.object({
        bucket: z.string(),
        fileKey: z.string(),
        eTag: z.string().optional(),
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
      200: z.object({}),
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
            fileKey: z.string(),
            uploadId: z.string().optional(),
            initiated: z.date().optional(),
            storageClass: z.string().optional(),
          }),
        ),
        isTruncated: z.boolean().optional(),
        nextKeyMarker: z.string().optional(),
        nextUploadIdMarker: z.string().optional(),
        prefix: z.string().optional(),
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
      fileKeys: z.array(z.string()).min(1).max(1000),
      quiet: z.boolean().optional(),
    }),
    responses: {
      200: z.object({
        deleted: z.array(
          z.object({
            fileKey: z.string(),
            deleteMarker: z.boolean().optional(),
          }),
        ),
        errors: z
          .array(
            z.object({
              fileKey: z.string().optional(),
              code: z.string().optional(),
              message: z.string().optional(),
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
    path: '/api/files/delete',
    headers: z.object({
      authorization: z.string(),
    }),
    query: z.object({
      fileKey: z.string(),
    }),
    body: z.undefined(),
    responses: {
      200: z.object({
        deleteMarker: z.boolean().optional(),
      }),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Delete a file',
  },

  copyFile: {
    method: 'POST',
    path: '/api/files/copy',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      sourceFileKey: z.string(),
      destinationFileKey: z.string(),
    }),
    responses: {
      200: z.object({
        copyObjectResult: z.object({
          eTag: z.string().optional(),
          lastModified: z.date().optional(),
        }),
        copySourceVersionId: z.string().optional(),
      }),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Copy a file',
  },

  renameFile: {
    method: 'POST',
    path: '/api/files/rename',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      fileKey: z.string(),
      newFileName: z.string(),
    }),
    responses: {
      200: z.object({
        copyObjectResult: z.object({
          eTag: z.string().optional(),
          lastModified: z.date().optional(),
        }),
        copySourceVersionId: z.string().optional(),
      }),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Rename a file',
  },

  moveFile: {
    method: 'POST',
    path: '/api/files/move',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      sourceFileKey: z.string(),
      destinationFileKey: z.string(),
    }),
    responses: {
      200: z.object({
        copyResponse: z.object({
          copyObjectResult: z
            .object({
              eTag: z.string().optional().optional(),
              lastModified: z.date().optional().optional(),
            })
            .optional(),
          copySourceVersionId: z.string().optional(),
        }),
        deleteResponse: z.object({
          deleteMarker: z.boolean().optional(),
        }),
      }),
      401: z.object({
        message: z.string(),
      }),
    },
    summary: 'Move a file (copy to destination and delete source)',
  },
} as const;
