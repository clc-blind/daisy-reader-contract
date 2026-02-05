import { z } from 'zod';
import {
  BackupDatabaseResponseSchema,
  GetBackupDownloadUrlResponseSchema,
  ListBackupsResponseSchema,
  RestoreDatabaseResponseSchema,
  SystemErrorResponseSchema,
} from '@/src/schema';

export const systemRoutes = {
  createBackup: {
    method: 'POST',
    path: '/api/system/backup',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: BackupDatabaseResponseSchema,
      401: SystemErrorResponseSchema,
      500: SystemErrorResponseSchema,
    },
    summary:
      'Create database backup, save to S3, and return presigned download URL (admin only)',
  },

  listBackups: {
    method: 'GET',
    path: '/api/system/backups',
    headers: z.object({
      authorization: z.string(),
    }),
    responses: {
      200: ListBackupsResponseSchema,
      401: SystemErrorResponseSchema,
      500: SystemErrorResponseSchema,
    },
    summary: 'List all available backups in S3 (admin only)',
  },

  getBackupDownloadUrl: {
    method: 'GET',
    path: '/api/system/backups/:backupId/download',
    headers: z.object({
      authorization: z.string(),
    }),
    pathParams: z.object({
      backupId: z.string(),
    }),
    responses: {
      200: GetBackupDownloadUrlResponseSchema,
      401: SystemErrorResponseSchema,
      404: SystemErrorResponseSchema,
      500: SystemErrorResponseSchema,
    },
    summary: 'Get download URL for a specific backup (admin only)',
  },

  deleteBackup: {
    method: 'DELETE',
    path: '/api/system/backups/:backupId',
    headers: z.object({
      authorization: z.string(),
    }),
    pathParams: z.object({
      backupId: z.string(),
    }),
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      401: SystemErrorResponseSchema,
      404: SystemErrorResponseSchema,
      500: SystemErrorResponseSchema,
    },
    summary: 'Delete a backup from S3 (admin only)',
  },

  restoreDatabase: {
    method: 'POST',
    path: '/api/system/restore',
    headers: z.object({
      authorization: z.string(),
    }),
    body: z.object({
      backupId: z.string().describe('Backup ID from S3 to restore'),
      clearExisting: z
        .boolean()
        .optional()
        .describe('Clear all existing data before restore (DANGEROUS)'),
    }),
    responses: {
      200: RestoreDatabaseResponseSchema,
      401: SystemErrorResponseSchema,
      400: SystemErrorResponseSchema,
      500: SystemErrorResponseSchema,
    },
    summary: 'Restore database from S3 backup ID (admin only)',
  },

  restoreFromFile: {
    method: 'POST',
    path: '/api/system/restore/upload',
    headers: z.object({
      authorization: z.string(),
    }),
    contentType: 'multipart/form-data',
    body: z
      .any()
      .describe('Multipart form data with file and optional clearExisting'),
    responses: {
      200: RestoreDatabaseResponseSchema,
      401: SystemErrorResponseSchema,
      400: SystemErrorResponseSchema,
      500: SystemErrorResponseSchema,
    },
    summary: 'Restore database from uploaded backup file (admin only)',
  },
} as const;
