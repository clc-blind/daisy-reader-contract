import { z } from 'zod';

// Base file metadata schema
export const FileMetadataSchema = z
  .object({
    fileKey: z.string().describe('Unique file key'),
    contentType: z.string().optional().describe('MIME content type'),
    contentEncoding: z.string().optional().describe('Content encoding'),
    contentLength: z.number().int().optional().describe('File size in bytes'),
    lastModified: z.date().optional().describe('Last modification timestamp'),
    eTag: z.string().optional().describe('Entity tag for cache validation'),
  })
  .describe('File metadata');

// List files response item
export const FileListItemSchema = z
  .object({
    fileName: z.string().describe('File name'),
    fileKey: z.string().describe('Unique file key'),
    isFolder: z.boolean().describe('Whether item is a folder'),
    contentType: z.string().optional().describe('MIME content type'),
    contentEncoding: z.string().optional().describe('Content encoding'),
    contentLength: z.number().int().optional().describe('File size in bytes'),
    lastModified: z.date().optional().describe('Last modification timestamp'),
    eTag: z.string().optional().describe('Entity tag for cache validation'),
  })
  .describe('File list item');

// Signed URL response
export const SignedUrlResponseSchema = z
  .object({
    fileKey: z.string().describe('File key'),
    url: z.string().url().describe('Pre-signed URL'),
  })
  .describe('Signed URL response');

// File content response
export const FileContentResponseSchema = z
  .object({
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
  })
  .describe('File content response');

// File exists response
export const FileExistsResponseSchema = z
  .object({
    fileKey: z.string().describe('File key'),
    exists: z.boolean().describe('Whether file exists'),
  })
  .describe('File existence check response');

// Folder exists response
export const FolderExistsResponseSchema = z
  .object({
    exists: z.boolean().describe('Whether folder exists'),
    keyCount: z.number().int().optional().describe('Number of items in folder'),
  })
  .describe('Folder existence check response');

// Create folder request/response
export const CreateFolderRequestSchema = z
  .object({
    folderKey: z.string().describe('Folder key/path'),
  })
  .describe('Create folder request');

export const CreateFolderResponseSchema = z
  .object({
    folderKey: z.string().describe('Created folder key'),
    created: z.boolean().describe('Whether folder was created'),
  })
  .describe('Create folder response');

// Upload URL request/response
export const UploadUrlRequestSchema = z
  .object({
    fileName: z.string().describe('File name'),
    contentType: z.string().optional().describe('MIME content type'),
    fileSize: z.number().int().optional().describe('File size in bytes'),
  })
  .describe('Upload URL request');

export const UploadUrlResponseSchema = z
  .object({
    uploadUrl: z.string().url().describe('Pre-signed upload URL'),
    fileKey: z.string().describe('File key for uploaded file'),
    expiresIn: z.number().int().describe('URL expiration time in seconds'),
  })
  .describe('Upload URL response');

// Direct upload request/response
export const DirectUploadRequestSchema = z
  .object({
    fileKey: z.string().describe('Target file key'),
    contentType: z.string().optional().describe('MIME content type'),
    content: z.string().describe('File content (base64 for binary)'),
  })
  .describe('Direct upload request');

export const DirectUploadResponseSchema = z
  .object({
    url: z.string().url().describe('File access URL'),
    contentLength: z.number().int().optional().describe('Uploaded file size'),
    fileKey: z.string().describe('Uploaded file key'),
    expiresIn: z.number().int().describe('URL expiration time in seconds'),
    eTag: z.string().optional().describe('Entity tag'),
  })
  .describe('Direct upload response');

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
  commonPrefixes: z.array(z.string()).optional(),
  isTruncated: z.boolean().optional(),
  nextContinuationToken: z.string().optional(),
  keyCount: z.number().int().optional(),
  prefix: z.string().optional(),
  maxKeys: z.number().int().optional(),
  delimiter: z.string().optional(),
});

// Book files list response
export const BookFilesListResponseSchema = z
  .object({
    bookId: z.string(),
    bookTitle: z.string(),
    storagePath: z.string(),
    totalFiles: z.number().int(),
    files: z.array(FileListItemSchema),
  })
  .describe('List of files associated with a book');

// Error response
export const FileErrorResponseSchema = z.object({
  message: z.string(),
});

// Bucket operations
export const BucketInfoSchema = z
  .object({
    name: z.string().describe('Bucket name'),
    creationDate: z.date().optional().describe('Bucket creation date'),
  })
  .describe('Bucket information');

export const CreateBucketRequestSchema = z
  .object({
    bucketName: z.string().describe('Name of bucket to create'),
  })
  .describe('Create bucket request');

export const CreateBucketResponseSchema = z
  .object({
    bucketName: z.string().describe('Created bucket name'),
    location: z.string().optional().describe('Bucket location/region'),
  })
  .describe('Create bucket response');

export const DeleteBucketRequestSchema = z
  .object({
    bucketName: z.string().describe('Name of bucket to delete'),
  })
  .describe('Delete bucket request');

export const DeleteBucketResponseSchema = z
  .object({
    bucketName: z.string().describe('Deleted bucket name'),
    deleted: z.boolean().describe('Whether deletion was successful'),
  })
  .describe('Delete bucket response');

export const ListBucketsResponseSchema = z
  .object({
    buckets: z.array(BucketInfoSchema).describe('List of buckets'),
    owner: z
      .object({
        displayName: z.string().optional(),
        id: z.string().optional(),
      })
      .optional()
      .describe('Bucket owner information'),
  })
  .describe('List buckets response');

export const CheckBucketExistsResponseSchema = z
  .object({
    bucketName: z.string().describe('Bucket name'),
    exists: z.boolean().describe('Whether bucket exists'),
  })
  .describe('Check bucket exists response');

export const CopyFileBetweenBucketsRequestSchema = z
  .object({
    sourceBucket: z.string().describe('Source bucket name'),
    sourceKey: z.string().describe('Source file key'),
    destinationBucket: z.string().describe('Destination bucket name'),
    destinationKey: z.string().describe('Destination file key'),
  })
  .describe('Copy file between buckets request');

export const MoveFileBetweenBucketsRequestSchema = z
  .object({
    sourceBucket: z.string().describe('Source bucket name'),
    sourceKey: z.string().describe('Source file key'),
    destinationBucket: z.string().describe('Destination bucket name'),
    destinationKey: z.string().describe('Destination file key'),
  })
  .describe('Move file between buckets request');

export const CrossBucketFileResponseSchema = z
  .object({
    sourceBucket: z.string(),
    sourceKey: z.string(),
    destinationBucket: z.string(),
    destinationKey: z.string(),
    eTag: z.string().optional(),
  })
  .describe('Cross-bucket file operation response');

export const BucketStatsSchema = z
  .object({
    bucketName: z.string().describe('Bucket name'),
    objectCount: z.number().int().describe('Total number of objects'),
    totalSize: z.number().describe('Total size in bytes'),
  })
  .describe('Bucket statistics');

export const DownloadFileResponseSchema = z
  .object({
    fileKey: z.string().describe('File key'),
    contentType: z.string().optional().describe('MIME content type'),
    contentLength: z.number().int().optional().describe('File size in bytes'),
    content: z.string().describe('File content (base64 for binary)'),
    eTag: z.string().optional().describe('Entity tag'),
  })
  .describe('Download file response');

// Type exports
export type FileMetadata = z.infer<typeof FileMetadataSchema>;
export type FileListItem = z.infer<typeof FileListItemSchema>;
export type FileContentResponse = z.infer<typeof FileContentResponseSchema>;
export type SignedUrlResponse = z.infer<typeof SignedUrlResponseSchema>;
export type FileExistsResponse = z.infer<typeof FileExistsResponseSchema>;
export type FolderExistsResponse = z.infer<typeof FolderExistsResponseSchema>;
export type CreateFolderRequest = z.infer<typeof CreateFolderRequestSchema>;
export type CreateFolderResponse = z.infer<typeof CreateFolderResponseSchema>;
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
export type BucketInfo = z.infer<typeof BucketInfoSchema>;
export type CreateBucketRequest = z.infer<typeof CreateBucketRequestSchema>;
export type CreateBucketResponse = z.infer<typeof CreateBucketResponseSchema>;
export type DeleteBucketRequest = z.infer<typeof DeleteBucketRequestSchema>;
export type DeleteBucketResponse = z.infer<typeof DeleteBucketResponseSchema>;
export type ListBucketsResponse = z.infer<typeof ListBucketsResponseSchema>;
export type CheckBucketExistsResponse = z.infer<
  typeof CheckBucketExistsResponseSchema
>;
export type CopyFileBetweenBucketsRequest = z.infer<
  typeof CopyFileBetweenBucketsRequestSchema
>;
export type MoveFileBetweenBucketsRequest = z.infer<
  typeof MoveFileBetweenBucketsRequestSchema
>;
export type CrossBucketFileResponse = z.infer<
  typeof CrossBucketFileResponseSchema
>;
export type BucketStats = z.infer<typeof BucketStatsSchema>;
export type DownloadFileResponse = z.infer<typeof DownloadFileResponseSchema>;
