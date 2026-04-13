import { z } from 'zod';

export const BackupDatabaseResponseSchema = z
  .object({
    backupId: z.string().describe('Backup file ID (filename)'),
    version: z.string().describe('Backup format version'),
    timestamp: z.string().describe('Backup creation timestamp'),
    size: z.number().int().describe('Backup file size in bytes'),
    downloadUrl: z
      .string()
      .describe('Presigned URL to download backup (expires in 1 hour)'),
    expiresAt: z.string().describe('When the download URL expires'),
  })
  .describe('Backup created and stored in S3');

export const ListBackupsResponseSchema = z
  .object({
    backups: z.array(
      z.object({
        backupId: z.string().describe('Backup file ID'),
        timestamp: z.string().describe('Backup creation timestamp'),
        size: z.number().int().describe('File size in bytes'),
      }),
    ),
    total: z.number().int().describe('Total number of backups'),
  })
  .describe('List of available backups in S3');

export const GetBackupDownloadUrlResponseSchema = z
  .object({
    backupId: z.string().describe('Backup file ID'),
    downloadUrl: z
      .string()
      .describe('Presigned URL to download backup (expires in 1 hour)'),
    expiresAt: z.string().describe('When the download URL expires'),
  })
  .describe('Download URL for specific backup');

export const RestoreDatabaseRequestSchema = z
  .object({
    backupId: z.string().describe('Backup ID from S3 to restore'),
    clearExisting: z
      .boolean()
      .optional()
      .default(false)
      .describe('Clear all existing data before restore (DANGEROUS)'),
  })
  .describe('Restore database request');

export const RestoreFromFileRequestSchema = z
  .object({
    file: z.any().describe('JSON backup file to restore'),
    clearExisting: z
      .boolean()
      .optional()
      .default(false)
      .describe('Clear all existing data before restore (DANGEROUS)'),
  })
  .describe('Restore from uploaded file request');

export const RestoreDatabaseResponseSchema = z
  .object({
    success: z.boolean().describe('Whether restore was successful'),
    imported: z
      .record(z.string(), z.number().int())
      .describe('Import statistics per table (tableName: recordCount)'),
    errors: z.array(z.string()).optional().describe('Any errors encountered'),
  })
  .describe('Restore database response');

// Type exports
export type BackupDatabaseResponse = z.infer<
  typeof BackupDatabaseResponseSchema
>;
export type ListBackupsResponse = z.infer<typeof ListBackupsResponseSchema>;
export type RestoreDatabaseRequest = z.infer<
  typeof RestoreDatabaseRequestSchema
>;
export type RestoreDatabaseResponse = z.infer<
  typeof RestoreDatabaseResponseSchema
>;
