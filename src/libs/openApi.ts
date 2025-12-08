// eslint-disable-next-line import/no-extraneous-dependencies
import { generateOpenApi } from '@ts-rest/open-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { betterAuth } from 'better-auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { admin, bearer, openAPI } from 'better-auth/plugins';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createAccessControl } from 'better-auth/plugins/access';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access';
// eslint-disable-next-line import/no-extraneous-dependencies
import { zodToJsonSchema } from 'zod-to-json-schema';
import { appContract } from '@/src/contract';
import {
  BookSchema,
  FileContentResponseSchema,
  FileMetadataSchema,
  MarkSchema,
  ReadingProgressSchema,
  UserPreferencesSchema,
} from '@/src/schema';

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const userRole = ac.newRole({
  ...userAc.statements,
});

const adminRole = ac.newRole({
  ...adminAc.statements,
});

const editorRole = ac.newRole({
  ...userAc.statements,
});

const generateOpenApiDocument = async () => {
  const baseOpenApiDocument = generateOpenApi(
    appContract,
    {
      info: {
        title: 'DAISY API',
        version: '1.0.0',
        description:
          'REST API for DAISY Reader application - accessible books for visually impaired users',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Better-auth session token',
          },
        },
      },
    },
    {
      setOperationId: true,
      jsonQuery: true,
      operationMapper: (operation, appRoute) => {
        // Add security to mutations (POST, PATCH, DELETE, PUT)
        const requiresAuth = ['POST', 'PATCH', 'DELETE', 'PUT'].includes(
          appRoute.method,
        );

        // Determine tags based on path
        let tags: string[] = ['General'];
        if (appRoute.path.includes('/books')) {
          tags = ['Books'];
        } else if (appRoute.path.includes('/users')) {
          tags = ['Users'];
        } else if (appRoute.path.includes('/progress')) {
          tags = ['Reading Progress'];
        } else if (appRoute.path.includes('/marks')) {
          tags = ['Marks'];
        } else if (appRoute.path.includes('/files')) {
          tags = ['Files'];
        }

        return {
          ...operation,
          tags,
          ...(requiresAuth && {
            security: [{ bearerAuth: [] }],
          }),
        };
      },
    },
  );

  const betterAuthOpenApiDocument = await betterAuth({
    emailAndPassword: {
      enabled: true,
      // NOTE: Disable signup via email/password
      disableSignUp: true,
    },
    plugins: [
      admin({
        ac,
        roles: {
          user: userRole,
          admin: adminRole,
          editor: editorRole,
        },
      }),
      bearer(),
      openAPI(),
    ],
  }).api.generateOpenAPISchema();

  // Prefix Better Auth paths with /api/auth and update tags
  const betterAuthPaths: Record<string, unknown> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [path, pathItem] of Object.entries(
    betterAuthOpenApiDocument.paths || {},
  )) {
    const updatedPathItem = pathItem as Record<string, unknown>;
    // Update tags for all methods in this path
    // eslint-disable-next-line no-restricted-syntax
    for (const method of Object.keys(updatedPathItem)) {
      if (
        ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(
          method,
        )
      ) {
        const operation = updatedPathItem[method] as Record<string, unknown>;
        operation.tags = ['Auth'];
      }
    }
    betterAuthPaths[`/api/auth${path}`] = updatedPathItem;
  }

  return {
    ...baseOpenApiDocument,
    info: {
      ...betterAuthOpenApiDocument.info,
      ...baseOpenApiDocument.info,
    },
    security: {
      ...betterAuthOpenApiDocument.security,
      ...baseOpenApiDocument.security,
    },
    components: {
      schemas: {
        ...betterAuthOpenApiDocument.components?.schemas,
        ...baseOpenApiDocument.components?.schemas,
        // Add our application schemas (extract from definitions)
        // Use target: 'openApi3' to generate OpenAPI 3.0 compatible schemas with nullable: true
        Book: zodToJsonSchema(BookSchema, {
          name: 'Book',
          target: 'openApi3',
        }).definitions!.Book,
        ReadingProgress: zodToJsonSchema(ReadingProgressSchema, {
          name: 'ReadingProgress',
          target: 'openApi3',
        }).definitions!.ReadingProgress,
        Mark: zodToJsonSchema(MarkSchema, {
          name: 'Mark',
          target: 'openApi3',
        }).definitions!.Mark,
        UserPreferences: zodToJsonSchema(UserPreferencesSchema, {
          name: 'UserPreferences',
          target: 'openApi3',
        }).definitions!.UserPreferences,
        FileMetadata: zodToJsonSchema(FileMetadataSchema, {
          name: 'FileMetadata',
          target: 'openApi3',
        }).definitions!.FileMetadata,
        FileContentResponse: zodToJsonSchema(FileContentResponseSchema, {
          name: 'FileContentResponse',
          target: 'openApi3',
        }).definitions!.FileContentResponse,
      },
      securitySchemes: {
        ...betterAuthOpenApiDocument.components?.securitySchemes,
        ...baseOpenApiDocument.components?.securitySchemes,
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and authorization endpoints',
      },
      { name: 'Books', description: 'Book catalog and content management' },
      { name: 'Users', description: 'User profile and preferences' },
      {
        name: 'Reading Progress',
        description: 'Track reading progress and history',
      },
      { name: 'Marks', description: 'Bookmarks, highlights, and notes' },
      { name: 'Files', description: 'File storage and management' },
    ],
    paths: {
      ...baseOpenApiDocument.paths,
      ...betterAuthPaths,
    },
  };
};

export const openApiDocument = await generateOpenApiDocument();
