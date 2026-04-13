/* eslint-disable no-continue */
// eslint-disable-next-line import/no-extraneous-dependencies
import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod';
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

const HTTP_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

type PathsObject = Record<string, Record<string, unknown>>;
type OperationObject = Record<string, unknown>;

const isHttpMethod = (method: string): method is HttpMethod =>
  (HTTP_METHODS as readonly string[]).includes(method);

const forEachOperation = (
  paths: PathsObject,
  callback: (options: {
    path: string;
    method: HttpMethod;
    operation: OperationObject;
  }) => void,
) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [path, pathItem] of Object.entries(paths)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!isHttpMethod(method)) continue;
      if (!operation || typeof operation !== 'object') continue;

      callback({
        path,
        method,
        operation: operation as OperationObject,
      });
    }
  }
};

const applyParameterDescriptionsToPaths = (paths: PathsObject): PathsObject => {
  forEachOperation(paths, ({ operation }) => {
    const { parameters } = operation;
    if (!Array.isArray(parameters)) return;

    // eslint-disable-next-line no-restricted-syntax
    for (const parameter of parameters) {
      if (!parameter || typeof parameter !== 'object') continue;
      const typedParameter = parameter as Record<string, unknown>;

      const existingDescription = typedParameter.description;
      if (typeof existingDescription === 'string' && existingDescription) {
        continue;
      }

      const { schema } = typedParameter;
      if (!schema || typeof schema !== 'object') continue;

      const typedSchema = schema as Record<string, unknown>;
      const schemaDescription = typedSchema.description;
      if (typeof schemaDescription !== 'string' || !schemaDescription) {
        continue;
      }

      typedParameter.description = schemaDescription;
    }
  });

  return paths;
};

const buildBetterAuthPaths = (
  paths: unknown,
): Record<string, Record<string, unknown>> => {
  const prefixedPaths: Record<string, Record<string, unknown>> = {};
  if (!paths || typeof paths !== 'object') return prefixedPaths;

  // eslint-disable-next-line no-restricted-syntax
  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== 'object') continue;
    const updatedPathItem = pathItem as Record<string, unknown>;

    // Tag Better Auth routes
    // eslint-disable-next-line no-restricted-syntax
    for (const [method, operation] of Object.entries(updatedPathItem)) {
      if (!isHttpMethod(method)) continue;
      if (!operation || typeof operation !== 'object') continue;

      const typedOperation = operation as Record<string, unknown>;
      typedOperation.tags = ['Auth'];
    }

    prefixedPaths[`/api/auth${path}`] = updatedPathItem;
  }

  return prefixedPaths;
};

const KNOWN_TAGS = [
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
  { name: 'System', description: 'System operations (backup/restore)' },
] as const;

const buildTags = (paths: PathsObject) => {
  const knownByName = new Set<string>(KNOWN_TAGS.map((t) => t.name));
  const discovered = new Set<string>();

  forEachOperation(paths, ({ operation }) => {
    const { tags } = operation;
    if (!Array.isArray(tags)) return;

    // eslint-disable-next-line no-restricted-syntax
    for (const tag of tags) {
      if (typeof tag !== 'string' || !tag) continue;
      discovered.add(tag);
    }
  });

  const extraTags = Array.from(discovered)
    .filter((name) => !knownByName.has(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name }));

  return [...KNOWN_TAGS, ...extraTags];
};

const generateOpenApiDocument = async (): Promise<unknown> => {
  const generator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });

  const baseOpenApiDocument = await generator.generate(appContract, {
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
  });

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

  const betterAuthPaths = buildBetterAuthPaths(betterAuthOpenApiDocument.paths);

  const basePaths = (baseOpenApiDocument.paths || {}) as PathsObject;
  const describedBasePaths = applyParameterDescriptionsToPaths(basePaths);
  const describedBetterAuthPaths =
    applyParameterDescriptionsToPaths(betterAuthPaths);

  const combinedPaths: PathsObject = {
    ...describedBasePaths,
    ...describedBetterAuthPaths,
  };

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
      },
      securitySchemes: {
        ...betterAuthOpenApiDocument.components?.securitySchemes,
        ...baseOpenApiDocument.components?.securitySchemes,
      },
    },
    tags: buildTags(combinedPaths),
    paths: {
      ...combinedPaths,
    },
  };
};

export const openApiDocument: unknown = await generateOpenApiDocument();
