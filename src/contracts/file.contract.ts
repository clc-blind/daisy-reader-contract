import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
  AbortMultipartRequestSchema,
  BatchDeleteRequestSchema,
  BatchDeleteResponseSchema,
  BookFilesListResponseSchema,
  BucketStatsSchema,
  CheckBucketExistsResponseSchema,
  CompleteMultipartRequestSchema,
  CompleteMultipartResponseSchema,
  CopyFileBetweenBucketsRequestSchema,
  CopyFileRequestSchema,
  CopyFileResponseSchema,
  CreateBucketRequestSchema,
  CreateBucketResponseSchema,
  CreateFolderRequestSchema,
  CreateFolderResponseSchema,
  CrossBucketFileResponseSchema,
  DeleteBucketResponseSchema,
  DeleteFileResponseSchema,
  DirectUploadRequestSchema,
  DirectUploadResponseSchema,
  DownloadFileResponseSchema,
  FileContentResponseSchema,
  FileExistsResponseSchema,
  FileMetadataSchema,
  FolderExistsResponseSchema,
  InitiateMultipartRequestSchema,
  InitiateMultipartResponseSchema,
  ListBucketsResponseSchema,
  ListFilesResponseSchema,
  ListMultipartUploadsResponseSchema,
  MoveFileBetweenBucketsRequestSchema,
  MoveFileRequestSchema,
  MoveFileResponseSchema,
  RenameFileRequestSchema,
  SignedUrlResponseSchema,
  UploadPartRequestSchema,
  UploadPartResponseSchema,
  UploadUrlRequestSchema,
  UploadUrlResponseSchema,
} from '@/src/schema';

const authHeaderSchema = z.object({
  authorization: z.string(),
});

const authUploadHeaderSchema = z.object({
  authorization: z.string(),
  'content-type': z.string(),
});

const o = oc.$route({ inputStructure: 'detailed', tags: ['Files'] });

export const fileRoutes = {
  listBookFiles: o
    .route({
      method: 'GET',
      path: '/api/books/{bookId}/files',
      summary: 'List all files for a book',
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
        }),
      }),
    )
    .output(BookFilesListResponseSchema),

  getBookFileContent: o
    .route({
      method: 'GET',
      path: '/api/books/{bookId}/files/{fileName}',
      summary: 'Get file content for a book',
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
          fileName: z.string(),
        }),
        query: z.object({
          expiresIn: z.coerce.number().optional(),
        }),
      }),
    )
    .output(FileContentResponseSchema),

  getBookAudioSignedUrl: o
    .route({
      method: 'GET',
      path: '/api/books/{bookId}/audio/{fileName}/signed-url',
      summary:
        'Get presigned URL for book audio file (deprecated: use getBookFileSignedUrl instead)',
      deprecated: true,
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
          fileName: z.string(),
        }),
        query: z.object({
          expiresIn: z.coerce.number().optional(),
        }),
      }),
    )
    .output(SignedUrlResponseSchema),

  getBookFileSignedUrl: o
    .route({
      method: 'GET',
      path: '/api/books/{bookId}/files/{fileName}/signed-url',
      summary:
        'Get presigned URL for any book file (cover, content, etc.) without authentication',
    })
    .input(
      z.object({
        params: z.object({
          bookId: z.string(),
          fileName: z.string(),
        }),
        query: z.object({
          expiresIn: z.coerce.number().optional(),
        }),
      }),
    )
    .output(SignedUrlResponseSchema),

  listFiles: o
    .route({
      method: 'GET',
      path: '/api/files/list',
      summary: 'List files and folders in storage with pagination support',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          prefix: z.string().optional(),
          delimiter: z.string().optional(),
          continuationToken: z.string().optional(),
          maxKeys: z.coerce.number().int().min(1).optional(),
        }),
      }),
    )
    .output(ListFilesResponseSchema),

  getSignedGetUrl: o
    .route({
      method: 'GET',
      path: '/api/files/signed-url',
      summary: 'Get presigned URL for downloading a file',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          fileKey: z.string(),
          expiresIn: z.coerce.number().optional(),
        }),
      }),
    )
    .output(SignedUrlResponseSchema),

  getFileMetadata: o
    .route({
      method: 'GET',
      path: '/api/files/metadata',
      summary: 'Get object metadata for a file',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          fileKey: z.string(),
        }),
      }),
    )
    .output(FileMetadataSchema),

  checkFileExists: o
    .route({
      method: 'GET',
      path: '/api/files/exists',
      summary: 'Check whether a file exists',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          fileKey: z.string(),
        }),
      }),
    )
    .output(FileExistsResponseSchema),

  checkFolderExists: o
    .route({
      method: 'GET',
      path: '/api/files/folder/exists',
      summary:
        'Check whether a folder (prefix) exists and optionally count objects',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          folderKey: z.string(),
        }),
      }),
    )
    .output(FolderExistsResponseSchema),

  createFolder: o
    .route({
      method: 'POST',
      path: '/api/files/folder/create',
      summary:
        'Create a folder by uploading an empty object with trailing slash',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: CreateFolderRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(CreateFolderResponseSchema),

  requestFileUploadUrl: o
    .route({
      method: 'POST',
      path: '/api/files/upload-url',
      summary: 'Get a presigned URL for uploading a file',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: UploadUrlRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(UploadUrlResponseSchema),

  uploadFile: o
    .route({
      method: 'PUT',
      path: '/api/files/upload',
      summary: 'Upload a file directly using S3 PutObject',
    })
    .input(
      z.object({
        headers: authUploadHeaderSchema,
        body: DirectUploadRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(DirectUploadResponseSchema),

  initiateMultipartUpload: o
    .route({
      method: 'POST',
      path: '/api/files/multipart/initiate',
      summary: 'Initiate multipart upload for large files',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: InitiateMultipartRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(InitiateMultipartResponseSchema),

  getUploadPartUrl: o
    .route({
      method: 'POST',
      path: '/api/files/multipart/part-url',
      summary: 'Get presigned URL for uploading a part',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: UploadPartRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(UploadPartResponseSchema),

  completeMultipartUpload: o
    .route({
      method: 'POST',
      path: '/api/files/multipart/complete',
      summary: 'Complete multipart upload',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: CompleteMultipartRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(CompleteMultipartResponseSchema),

  abortMultipartUpload: o
    .route({
      method: 'POST',
      path: '/api/files/multipart/abort',
      summary: 'Abort multipart upload',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: AbortMultipartRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(z.object({})),

  listMultipartUploads: o
    .route({
      method: 'GET',
      path: '/api/files/multipart/list',
      summary: 'List in-progress multipart uploads',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          prefix: z.string().optional(),
          keyMarker: z.string().optional(),
          uploadIdMarker: z.string().optional(),
          maxUploads: z.coerce.number().int().min(1).max(1000).optional(),
        }),
      }),
    )
    .output(ListMultipartUploadsResponseSchema),

  deleteFiles: o
    .route({
      method: 'POST',
      path: '/api/files/batch-delete',
      summary: 'Delete multiple files in a single request',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: BatchDeleteRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(BatchDeleteResponseSchema),

  deleteFile: o
    .route({
      method: 'DELETE',
      path: '/api/files/delete',
      summary: 'Delete a file',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          fileKey: z.string(),
        }),
      }),
    )
    .output(DeleteFileResponseSchema),

  copyFile: o
    .route({
      method: 'POST',
      path: '/api/files/copy',
      summary: 'Copy a file',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: CopyFileRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(CopyFileResponseSchema),

  renameFile: o
    .route({
      method: 'POST',
      path: '/api/files/rename',
      summary: 'Rename a file',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: RenameFileRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(CopyFileResponseSchema),

  moveFile: o
    .route({
      method: 'POST',
      path: '/api/files/move',
      summary: 'Move a file (copy to destination and delete source)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: MoveFileRequestSchema.extend({
          bucket: z.string().optional(),
        }),
      }),
    )
    .output(MoveFileResponseSchema),

  createBucket: o
    .route({
      method: 'POST',
      path: '/api/buckets/create',
      summary: 'Create a new storage bucket',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: CreateBucketRequestSchema,
      }),
    )
    .output(CreateBucketResponseSchema),

  deleteBucket: o
    .route({
      method: 'DELETE',
      path: '/api/buckets/delete',
      summary: 'Delete a storage bucket (must be empty)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucketName: z.string(),
        }),
      }),
    )
    .output(DeleteBucketResponseSchema),

  listBuckets: o
    .route({
      method: 'GET',
      path: '/api/buckets/list',
      summary: 'List all storage buckets with pagination',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
      }),
    )
    .output(ListBucketsResponseSchema),

  checkBucketExists: o
    .route({
      method: 'GET',
      path: '/api/buckets/exists',
      summary: 'Check if a bucket exists',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucketName: z.string(),
        }),
      }),
    )
    .output(CheckBucketExistsResponseSchema),

  copyFileBetweenBuckets: o
    .route({
      method: 'POST',
      path: '/api/files/copy-between-buckets',
      summary: 'Copy a file from one bucket to another',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: CopyFileBetweenBucketsRequestSchema,
      }),
    )
    .output(CrossBucketFileResponseSchema),

  moveFileBetweenBuckets: o
    .route({
      method: 'POST',
      path: '/api/files/move-between-buckets',
      summary: 'Move a file from one bucket to another',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: MoveFileBetweenBucketsRequestSchema,
      }),
    )
    .output(CrossBucketFileResponseSchema),

  getBucketStats: o
    .route({
      method: 'GET',
      path: '/api/buckets/stats',
      summary: 'Get bucket statistics (object count, total size)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucketName: z.string(),
        }),
      }),
    )
    .output(BucketStatsSchema),

  downloadFile: o
    .route({
      method: 'GET',
      path: '/api/files/download',
      summary: 'Download file content directly',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        query: z.object({
          bucket: z.string().optional(),
          fileKey: z.string(),
        }),
      }),
    )
    .output(DownloadFileResponseSchema),
} as const;
