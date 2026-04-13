import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
  BackupDatabaseResponseSchema,
  GetBackupDownloadUrlResponseSchema,
  ListBackupsResponseSchema,
  RestoreDatabaseResponseSchema,
} from '@/src/schema';

const authHeaderSchema = z.object({
  authorization: z.string(),
});

const o = oc.$route({ inputStructure: 'detailed', tags: ['System'] });

export const systemRoutes = {
  createBackup: o
    .route({
      method: 'POST',
      path: '/api/system/backup',
      summary:
        'Create database backup, save to S3, and return presigned download URL (admin only)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: z.object({}),
      }),
    )
    .output(BackupDatabaseResponseSchema),

  listBackups: o
    .route({
      method: 'GET',
      path: '/api/system/backups',
      summary: 'List all available backups in S3 (admin only)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
      }),
    )
    .output(ListBackupsResponseSchema),

  getBackupDownloadUrl: o
    .route({
      method: 'GET',
      path: '/api/system/backups/{backupId}/download',
      summary: 'Get download URL for a specific backup (admin only)',
    })
    .input(
      z.object({
        params: z.object({
          backupId: z.string(),
        }),
        headers: authHeaderSchema,
      }),
    )
    .output(GetBackupDownloadUrlResponseSchema),

  deleteBackup: o
    .route({
      method: 'DELETE',
      path: '/api/system/backups/{backupId}',
      summary: 'Delete a backup from S3 (admin only)',
      successStatus: 200,
    })
    .input(
      z.object({
        params: z.object({
          backupId: z.string(),
        }),
        headers: authHeaderSchema,
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    ),

  restoreDatabase: o
    .route({
      method: 'POST',
      path: '/api/system/restore',
      summary: 'Restore database from S3 backup ID (admin only)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: z.object({
          backupId: z.string().describe('Backup ID from S3 to restore'),
          clearExisting: z
            .boolean()
            .optional()
            .describe('Clear all existing data before restore (DANGEROUS)'),
        }),
      }),
    )
    .output(RestoreDatabaseResponseSchema),

  restoreFromFile: o
    .route({
      method: 'POST',
      path: '/api/system/restore/upload',
      summary: 'Restore database from uploaded backup file (admin only)',
    })
    .input(
      z.object({
        headers: authHeaderSchema,
        body: z
          .any()
          .describe('Multipart form data with file and optional clearExisting'),
      }),
    )
    .output(RestoreDatabaseResponseSchema),
} as const;
