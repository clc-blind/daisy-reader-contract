# Agent Workflow Guidelines

## Code Conventions

### Naming Conventions

**Consistency is critical.** Always follow existing naming patterns in the codebase:

#### TypeScript/JavaScript

- **Variables and Parameters**: Use `camelCase`
  - ✅ `bookList`, `queryParams`, `responseData`
  - ❌ `book_list`, `query-params`, `ResponseData`

- **Constants**: Use `UPPER_SNAKE_CASE`
  - ✅ `DEFAULT_LIMIT`, `MAX_PAGE_SIZE`
  - ❌ `defaultLimit`, `maxPageSize`

- **Types and Interfaces**: Use `PascalCase`
  - ✅ `Book`, `PaginationQuery`, `BookListResponse`
  - ❌ `book`, `paginationQuery`, `book_list_response`
  - **Prefer `type` over `interface`** for better composability and type inference
  - Use `interface` only when declaration merging or extending classes is needed
  - **Avoid type bloating** - reuse existing types instead of creating duplicates
  - **Use intersection types (`&`)** for composition: `type Extended = Base & Additional`
  - **Extract types from Zod schemas** using `z.infer<typeof Schema>` rather than duplicating definitions
  - Example of good type composition:

    ```typescript
    // ✅ Good - reuse and compose with intersection
    type PaginationQuery = { limit?: number; offset?: number };
    type SearchQuery = PaginationQuery & { q: string };

    // ❌ Bad - duplicate fields
    type SearchQuery = {
      limit?: number;
      offset?: number;
      q: string;
    };
    ```

- **Functions**: Use `camelCase`
  - ✅ `getBooks`, `createUser`, `updateReading`
  - ❌ `get_books`, `CreateUser`

#### File and Directory Naming

- **Contract Files**: Use domain name with `.contract.ts` suffix
  - Format: `contracts/{domain}.contract.ts`
  - ✅ `book.contract.ts`, `user.contract.ts`, `reading.contract.ts`
  - ❌ `bookContract.ts`, `book-contract.ts`, `Book.contract.ts`

- **Schema Files**: Use domain name with `.schema.ts` suffix
  - Format: `schemas/{domain}.schema.ts`
  - ✅ `book.schema.ts`, `user.schema.ts`, `mark.schema.ts`
  - ❌ `bookSchema.ts`, `book-schema.ts`, `Book.schema.ts`

### Project Structure Conventions

- **Contracts**: API endpoint definitions in `src/contracts/`
  - Each domain has its own contract file (e.g., `book.contract.ts`)
  - Export route objects with endpoint definitions
  - Use Zod schemas for query, body, and response validation
  - Always include `summary` for OpenAPI documentation
  - Pattern: `export const {domain}Routes = { endpointName: { method, path, query?, body?, responses } }`

- **Schemas**: Zod schema definitions in `src/schemas/`
  - Define ALL Zod schemas in schema files
  - Export TypeScript types using `z.infer<typeof Schema>`
  - Group related schemas together (entity, query, response)
  - Compose schemas using `.extend()`, `.merge()`, `.omit()`, `.partial()`
  - Pattern: Define schema first, then export inferred type

- **Main Contract**: Combine all routes in `src/contract.ts`
  - Import all domain routes
  - Use `initContract()` from `@ts-rest/core`
  - Combine routes with spread operator
  - Keep organized by domain with comments

- **Schema Export**: Central export in `src/schema.ts`
  - Re-export all schemas from domain files
  - Allows single import point: `import { BookSchema, UserSchema } from '@/src/schema'`

- **OpenAPI Generation**: Script in `scripts/generateOpenApi.ts`
  - Uses `@ts-rest/open-api` to generate spec
  - Outputs to `openapi/openapi.json`
  - Run via `pnpm openapi:generate`

### Schema and Type Management

**Use Zod as the single source of truth for runtime validation and type definitions:**

- **Define schemas in `src/schemas/{domain}.schema.ts`** using Zod
- **Extract TypeScript types** from schemas using `z.infer<typeof Schema>`
- **Never duplicate type definitions** - if a schema exists, use `z.infer`
- **Reuse schema fragments** - compose schemas using `.extend()`, `.merge()`, `.omit()`, `.partial()`
- **Always export both schema AND inferred type** from schema files

**Schema Composition Best Practices:**

- **Use `.extend()` for adding fields** to existing schemas
- **Use `.merge()` for combining independent schemas** (e.g., pagination + filters)
- **Use `.omit()` for excluding fields** (e.g., create/update DTOs)
- **Use `.partial()` for making all fields optional** (e.g., patch/update endpoints)
- **Group related schemas** - entity, query parameters, response types in same file
- **Keep schemas simple** - avoid over-nesting or complex transformations

**Examples:**

```typescript
// ✅ Good - Schema-first approach with type export
export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().nullable(),
});
export type Book = z.infer<typeof BookSchema>;

// ✅ Good - Compose schemas with .merge()
export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export const BookFilterQuerySchema = PaginationQuerySchema.merge(
  z.object({
    author: z.string().optional(),
    subject: z.string().optional(),
  }),
);
export type BookFilterQuery = z.infer<typeof BookFilterQuerySchema>;

// ✅ Good - Use .omit() for DTOs
export const CreateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ✅ Good - Use .partial() for updates
export const UpdateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// ✅ Good - Response schema with nested array
export const BookListResponseSchema = z.object({
  data: z.array(BookSchema),
  total: z.number(),
});
export type BookListResponse = z.infer<typeof BookListResponseSchema>;

// ❌ Bad - Duplicate type definition when schema exists
const BookSchema = z.object({ id: z.string(), title: z.string() });
type Book = { id: string; title: string }; // Duplicates schema

// ❌ Bad - Manually duplicate fields instead of composing
const BookFilterQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  author: z.string().optional(),
  subject: z.string().optional(),
});
```

**When to use `interface` vs `type`:**

- **Default: use `type`** for all type aliases, unions, intersections
- **Always extract types from Zod schemas** using `z.infer`
- **Use `interface`** only when:
  - You need declaration merging (rare in application code)
  - You're extending a class
  - You're defining a contract for a plugin system

### Preferred Dependencies and Utilities

**Always use these libraries when applicable:**

- **Zod** - Use for all runtime validation and schema definitions
  - Define schemas in `src/schemas/{domain}.schema.ts`
  - Extract types with `z.infer<typeof Schema>`
  - Prefer Zod validation over manual type checking
  - Use Zod for parsing request inputs, query parameters, and API responses
  - Always export both schema and inferred type
  - Example: `const result = MySchema.safeParse(data)` instead of manual validation

- **@ts-rest/core** - Use for defining type-safe API contracts
  - Initialize contract with `initContract()`
  - Define routes with typed request/response schemas
  - Always include `summary` for OpenAPI documentation
  - Use Zod schemas for all query, body, and response validation

- **@ts-rest/open-api** - Use for generating OpenAPI specifications
  - Generate OpenAPI spec from ts-rest contracts
  - Outputs to `openapi/openapi.json`
  - Run via `pnpm openapi:generate`

**Examples:**

```typescript
// ✅ Good - Schema with type export
export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
});
export type Book = z.infer<typeof BookSchema>;

// ✅ Good - Contract with Zod schemas
export const bookRoutes = {
  getAllBooks: {
    method: 'GET',
    path: '/api/books',
    query: PaginationQuerySchema,
    responses: {
      200: BookListResponseSchema,
    },
    summary: 'Get all books with pagination',
  },
};

// ✅ Good - Compose schemas for complex queries
export const BookFilterQuerySchema = PaginationQuerySchema.merge(
  SortQuerySchema,
).extend({
  author: z.string().optional(),
});

// ❌ Bad - Manual validation when Zod should be used
if (typeof query.limit !== 'number') throw new Error('Invalid limit');

// ❌ Bad - Defining types without schemas
type BookFilterQuery = {
  limit?: number;
  offset?: number;
  author?: string;
};
```

````

### ES Module Compatibility

**This project uses ES modules (`"type": "module"` in package.json):**

- **Always use ES module syntax** for imports/exports
- **Never use CommonJS** (`require`, `module.exports`)
- **Use `.cjs` extension for CommonJS config files** if absolutely necessary
  - ✅ `.eslintrc.cjs` - CommonJS config file
  - ❌ `.eslintrc.js` - Will be treated as ES module

**Example:**

```typescript
// ✅ Good - ES module imports/exports
import { z } from 'zod';
import { BookSchema } from '@/src/schema';

export const bookRoutes = { /* ... */ };

// ❌ Bad - CommonJS (won't work)
const { z } = require('zod');
module.exports = { bookRoutes };
````

### Adding New API Endpoints

When adding a new API endpoint, ensure consistency and simplicity:

1. **Define Schemas First** in `src/schemas/{domain}.schema.ts`:
   - Create or update Zod schemas for request/response
   - Export inferred TypeScript types
   - Compose existing schemas when possible (`.merge()`, `.extend()`, `.omit()`, `.partial()`)
   - Keep schemas simple - avoid over-engineering

2. **Create or Update Contract** in `src/contracts/{domain}.contract.ts`:
   - Import necessary schemas from `@/src/schema`
   - Define endpoint with clear, RESTful path
   - Specify HTTP method (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`)
   - Add `query`, `body`, or `headers` schemas as needed
   - Define `responses` with status codes and schemas
   - **Always include `summary`** for OpenAPI documentation

3. **Export from Central Files**:
   - Add schema exports to `src/schema.ts` if new schema file created
   - Routes are automatically included when spreading in `src/contract.ts`

4. **Generate OpenAPI Spec**:
   - Run `pnpm openapi:generate` to update `openapi/openapi.json`
   - Verify the generated spec includes your new endpoint

5. **Keep It Simple**:
   - Don't over-complicate schemas with transformations
   - Reuse existing query schemas (pagination, sorting, filtering)
   - Use `.omit()` for create DTOs, `.partial()` for update DTOs
   - Follow existing patterns in the codebase

**Example Pattern:**

```typescript
// 1. Define schemas in src/schemas/book.schema.ts
export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Book = z.infer<typeof BookSchema>;

// 2. Define contract in src/contracts/book.contract.ts
export const bookRoutes = {
  createBook: {
    method: 'POST',
    path: '/api/books',
    body: CreateBookSchema,
    responses: {
      201: BookSchema,
    },
    summary: 'Create a new book',
  },
};
```

## Development Workflow

When implementing new features or making changes, follow this systematic approach:

### 1. Code Implementation

- Implement the requested feature with clean, maintainable code
- Follow existing code patterns and conventions
- Use TypeScript best practices
- Ensure proper error handling
- **Keep solutions simple** - avoid over-engineering

### 2. Quality Checks (Run ALL Before Completion)

**Type Check:**

```bash
pnpm lint
```

- Ensures TypeScript compilation succeeds
- Validates type safety across the codebase
- Fix ALL type errors before proceeding

**Build:**

```bash
pnpm build
```

- Generates OpenAPI spec automatically
- Compiles TypeScript to multiple formats
- Ensures build process succeeds

**Tests (if available):**

```bash
pnpm test
```

- Run all test suites
- Ensure ALL tests pass
- Add new tests for new features

### 3. Documentation Updates

**README.md:**

- Update usage examples if API changes
- Add documentation for new endpoints or domains
- Document schema changes if significant
- Keep examples clear and concise

**IMPORTANT:**

- **DO NOT** create separate markdown files for documentation unless explicitly requested
- **DO NOT** create CHANGES.md, UPDATES.md, or similar summary files
- Update README.md directly with new information
- Keep documentation concise and focused

### 4. OpenAPI Generation

**Always regenerate after schema/contract changes:**

```bash
pnpm openapi:generate
```

- Updates `openapi/openapi.json`
- Ensures API documentation is current
- Validates contract definitions

### 5. Completion Checklist

Before marking work as complete:

- [ ] ✅ Type checking passes (`pnpm lint`)
- [ ] ✅ Build succeeds (`pnpm build`)
- [ ] ✅ OpenAPI spec regenerated (`pnpm openapi:generate`)
- [ ] ✅ All tests pass (if tests exist)
- [ ] ✅ README.md updated with new features
- [ ] ✅ No unnecessary documentation files created
- [ ] ✅ Code follows existing patterns
- [ ] ✅ Exports updated in src/schema.ts if needed
- [ ] ✅ Solutions are simple and maintainable

## Project Structure

### This is a TypeScript API Contract Library

**Core Components:**

- **API Contracts** - Type-safe endpoint definitions using @ts-rest/core
- **Zod Schemas** - Runtime validation and type definitions
- **OpenAPI Generation** - Automatic spec generation from contracts
- **Type Exports** - Reusable types extracted from schemas

### Key Directories

- `src/contracts/` - API endpoint contract definitions by domain
- `src/schemas/` - Zod schema definitions by domain
- `src/contract.ts` - Main contract combining all routes
- `src/schema.ts` - Central schema export file
- `src/index.ts` - Package entry point
- `openapi/` - Generated OpenAPI specification
- `scripts/` - Build and generation scripts

### Project Purpose

This library provides:

- **Type-safe API contracts** for client-server communication
- **Runtime validation** via Zod schemas
- **OpenAPI documentation** auto-generated from contracts
- **Shared types** for both frontend and backend
- **Single source of truth** for API definitions

## Common Tasks

### Adding New Domain

1. Create schema file in `src/schemas/{domain}.schema.ts`
2. Define Zod schemas and export types
3. Create contract file in `src/contracts/{domain}.contract.ts`
4. Import schemas and define routes
5. Add export to `src/schema.ts`
6. Import and spread routes in `src/contract.ts`
7. Run `pnpm openapi:generate`
8. Update README.md with examples

### Adding New Endpoint to Existing Domain

1. Update schema in `src/schemas/{domain}.schema.ts` if needed
2. Add route definition to `src/contracts/{domain}.contract.ts`
3. Run `pnpm openapi:generate`
4. Update README.md if public-facing

### Updating Schemas

1. Modify schemas in `src/schemas/{domain}.schema.ts`
2. Update affected contracts if needed
3. Run `pnpm lint` to check types
4. Run `pnpm build` to verify
5. Update README.md if breaking changes

## Error Handling

Always provide clear error messages:

- Validation errors should indicate what's wrong and which field failed
- Use Zod's built-in error messages for validation
- Schema errors should be descriptive
- Include context in error messages (endpoint, domain, operation)

## Best Practices

### Keep It Simple

- **Avoid over-engineering** - Use straightforward solutions
- **Reuse existing schemas** - Don't create duplicates
- **Compose rather than duplicate** - Use `.merge()`, `.extend()`, `.omit()`, `.partial()`
- **Follow existing patterns** - Match code style in similar files
- **Minimal transformations** - Let Zod handle coercion (e.g., `z.coerce.number()`)

### Schema Design

- **Define once, use everywhere** - Extract types with `z.infer`
- **Group related schemas** - Keep entity, query, and response schemas together
- **Use semantic names** - `PaginationQuery` not `QueryParams`
- **Export both schema and type** - `export const Schema` and `export type Type`
- **Common patterns**:
  - Use `.omit()` for create DTOs (remove `id`, timestamps)
  - Use `.partial()` for update DTOs (all fields optional)
  - Use `.merge()` to combine query schemas (pagination + filters)
  - Use `z.coerce.number()` for query params that need type conversion

### Contract Design

- **RESTful paths** - Use standard conventions (`/api/resources/:id`)
- **Descriptive summaries** - Always include for OpenAPI docs
- **Logical grouping** - Group routes by domain/resource
- **Consistent responses** - Use common response schemas across endpoints
- **Proper status codes** - 200 for success, 201 for creation, etc.

## Remember

1. **Quality over speed** - Take time to do it right
2. **Follow patterns** - Match existing code style
3. **Document as you go** - Update README.md immediately
4. **Keep it simple** - Don't create unnecessary complexity
5. **Validate everything** - Use Zod for all data validation
6. **Type safety first** - Extract types from schemas, never duplicate
