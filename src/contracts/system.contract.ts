import { z } from 'zod';
import {
  BackupDatabaseResponseSchema,
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
    contentType: 'multipart/form-data',
    body: z.object({
      file: z
        .any()
        .optional()
        .describe('JSON backup file to restore (if not using backupId)'),
      backupId: z
        .string()
        .optional()
        .describe('Backup ID from S3 to restore (if not uploading file)'),
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
    summary: 'Restore database from S3 backup ID or uploaded file (admin only)',
  },
} as const;
