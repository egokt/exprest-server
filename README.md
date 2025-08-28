# Exprest Server

Exprest is a TypeScript framework for building type-safe REST APIs and web clients. The server package provides a structured approach to creating Express.js endpoints with built-in input validation, authentication support, and standardized response formats.

## Design Philosophy

Exprest enforces **separation of concerns** by breaking endpoint implementation into discrete, composable functions. This approach improves code reviewability, testability, and maintainability by making each responsibility explicit.

Key principles:

- **Type safety**: Full TypeScript support ensures compile-time guarantees between client and server
- **Structured validation**: Input sanitization is mandatory and separated from business logic
- **Standardized responses**: Consistent JSON response format across all endpoints
- **Express compatibility**: Built on Express.js, works with existing middleware
- **Authentication flexibility**: Optional authentication support using Express middleware patterns

## Package Structure

- **exprest-server** (this package): API endpoint factories and utilities
- **exprest-web-client**: Type-safe client library for consuming exprest APIs
- **exprest-shared**: Common types and interfaces shared between client and server

## Core Concepts

### Resources and Endpoints

A **resource** represents an API entity accessible via URI (e.g., `/users`). Exprest supports two resource patterns:

- **Collection Resource**: Manages multiple entities with unique identifiers (e.g., `/users/:id`)
- **Singleton Resource**: Manages a single entity without an identifier (e.g., `/current-user`)

An **endpoint** combines a resource URI, HTTP method, and request handler. Exprest provides these endpoint types:

**Collection-focused endpoints:**

- `getEntity` - GET `/resource/:id` - Retrieve a specific entity
- `getCollection` - GET `/resource` - Retrieve multiple entities
- `updateEntity` - PUT `/resource/:id` - Update a specific entity
- `deleteEntity` - DELETE `/resource/:id` - Remove a specific entity

**Singleton-focused endpoints:**

- `getSingleton` - GET `/resource` - Retrieve the singleton entity
- `updateSingleton` - PUT `/resource` - Update the singleton entity
- `deleteSingleton` - DELETE `/resource` - Remove the singleton entity

**Universal endpoints:**

- `create` - POST `/resource` - Create a new entity
- `action` - POST `/resource/action-name` - Custom operations with flexible semantics

### Response Format

All endpoints return standardized JSON responses:

**Success responses:**

```typescript
// Entity responses
{ entity: T }
{ entity: T, other_data: U }

// Collection responses
{ collection: Array<T> }
{ collection: Array<T>, other_data: U }

// Action responses
{ actionResult: T }

// Error responses
{ errors: Array<string> }
```

## Quick Start

### Installation

```bash
npm install exprest-server exprest-shared express
npm install -D @types/express
```

### Basic Example

```typescript
import express from "express";
import { getEntityWoAuth, addGetEntityRoute } from "exprest-server";

// Define your types
type User = { id: number; name: string; email: string };
type UserResponse = { id: number; name: string }; // Client-facing type

// Create request handler
const getUserHandler = getEntityWoAuth<User, UserResponse, {}, {}>({
  contextCreateFunction: () => ({}),

  sanitizeIdFunction: ({ idParam }) => {
    const id = Number(idParam);
    if (isNaN(id)) return [["Invalid user ID"], null];
    return [null, id];
  },

  sanitizeHeadersFunction: () => [null, {}],
  sanitizeParamsFunction: () => [null, {}],

  retrieveEntityFunction: async ({ submittedEntityId }) => {
    // Your database query here
    return await db.users.findById(submittedEntityId);
  },

  convertToFrontEndEntityFunction: ({ entity }) => ({
    id: entity.id,
    name: entity.name,
    // Note: email field is excluded from response
  }),
});

// Add to router
const router = express.Router();
addGetEntityRoute("id", router, "/users", getUserHandler);

const app = express();
app.use("/api", router);
app.listen(3000);
```

This creates a `GET /api/users/:id` endpoint that returns `{ entity: { id: number, name: string } }`.

## Request Handler Functions

Each endpoint type uses a **function chain** to handle requests. Functions are called in a specific order, and errors in early functions prevent later ones from executing.

### Function Execution Order

For most endpoints, functions execute in this sequence:

1. **`contextCreateFunction`** - Initialize request context
2. **`sanitizeIdFunction`** - Validate entity ID (entity endpoints only)
3. **`sanitizeHeadersFunction`** - Validate and transform headers
4. **`sanitizeParamsFunction`** - Validate and transform query parameters
5. **`sanitizeBodyFunction`** - Validate and transform request body (create/update endpoints)
6. **`determineAuthorityToChangeFunction`** - Check permissions (create/update/delete endpoints)
7. **Main function** - Core business logic (retrieve, create, update, delete, or action)
8. **`convertToFrontEndEntityFunction`** - Transform entity for response
9. **`otherDataValueOrFunction`** - Add additional response data
10. **`postExecutionFunction`** - Cleanup, logging, etc.

### Function Parameters

**`contextCreateFunction({})`**

- **Purpose**: Initialize request-scoped context object
- **Returns**: Context object passed to subsequent functions

**`sanitizeIdFunction({ idParam })`** _(entity endpoints only)_

- **Purpose**: Validate and transform the entity ID from URL parameter
- **Returns**: `[null, parsedId]` on success, `[["error message"], null]` on failure

**`sanitizeHeadersFunction({ unsanitizedHeaders, context, user?, submittedEntityId? })`**

- **Purpose**: Validate and transform request headers
- **Returns**: `[null, sanitizedHeaders]` on success, `[["errors"], null]` on failure

**`sanitizeParamsFunction({ unsanitizedParams, headers, context, user?, submittedEntityId? })`**

- **Purpose**: Validate and transform query parameters
- **Returns**: `[null, sanitizedParams]` on success, `[["errors"], null]` on failure

**`sanitizeBodyFunction({ unsanitizedBody, headers, params, context, user?, submittedEntityId? })`** _(create/update endpoints)_

- **Purpose**: Validate and transform request body
- **Returns**: `[null, sanitizedBody]` on success, `[["errors"], null]` on failure

**Main Functions:**

- **`retrieveEntityFunction({ headers, params, context, user?, submittedEntityId? })`**
  - **Returns**: Entity object or `null` if not found
- **`createEntityFunction({ headers, params, body, context, user? })`**
  - **Returns**: Created entity object or `null` on failure
- **`updateEntityFunction({ headers, params, body, context, user?, submittedEntityId? })`**
  - **Returns**: Updated entity object or `null` on failure
- **`deleteEntityFunction({ headers, params, context, user?, submittedEntityId? })`**
  - **Returns**: Deleted entity object or `null` on failure

**`convertToFrontEndEntityFunction({ entity, headers, params, context, user?, submittedEntityId? })`**

- **Purpose**: Transform backend entity to client-facing format
- **Returns**: Frontend entity object

**`otherDataValueOrFunction`** _(optional)_

- **Purpose**: Provide additional data in response
- **Can be**: Static value or function returning additional data

**`postExecutionFunction({ status, isSuccessful, headers?, params?, context, ... })`** _(optional)_

- **Purpose**: Cleanup, logging, analytics, etc.
- **Returns**: `void`

## Authentication Support

Each endpoint type comes in two variants:

- **`*WoAuth`** - No authentication required
- **`*WithAuth`** - Authentication required, returns 401 if no user present

Authentication uses Express middleware that sets `req.user`. Compatible with [Passport.js](https://www.passportjs.org/) and similar libraries.

```typescript
import { getEntityWithAuth } from "exprest-server";

const handler = getEntityWithAuth<User, UserData, UserResponse, {}, {}>({
  contextCreateFunction: ({ user }) => ({ userId: user.id }),
  // ... other functions receive 'user' parameter
});
```

## Complete Endpoint Examples

### Create Endpoint with Validation

```typescript
import { createWoAuth, addCreateRoute } from "exprest-server";

type CreateUserRequest = { name: string; email: string };
type User = { id: number; name: string; email: string; createdAt: Date };

const createUserHandler = createWoAuth<
  User,
  UserResponse,
  {},
  {},
  CreateUserRequest
>({
  contextCreateFunction: () => ({}),
  sanitizeHeadersFunction: () => [null, {}],
  sanitizeParamsFunction: () => [null, {}],

  sanitizeBodyFunction: ({ unsanitizedBody }) => {
    const { name, email } = unsanitizedBody;

    if (!name || typeof name !== "string") {
      return [["Name is required"], null];
    }
    if (!email || !email.includes("@")) {
      return [["Valid email is required"], null];
    }

    return [null, { name: name.trim(), email: email.toLowerCase() }];
  },

  createEntityFunction: async ({ body }) => {
    return await db.users.create({
      name: body.name,
      email: body.email,
      createdAt: new Date(),
    });
  },

  convertToFrontEndEntityFunction: ({ entity }) => ({
    id: entity.id,
    name: entity.name,
  }),
});

addCreateRoute(router, "/users", createUserHandler);
```

### Action Endpoint

```typescript
import { actionWoAuth, addActionRoute } from "exprest-server";

type MakeAdminResult = { success: boolean; message: string };

const makeAdminHandler = actionWoAuth<
  MakeAdminResult,
  {},
  {},
  { userId: number }
>({
  contextCreateFunction: () => ({}),
  sanitizeHeadersFunction: () => [null, {}],
  sanitizeParamsFunction: () => [null, {}],

  sanitizeBodyFunction: ({ unsanitizedBody }) => {
    const userId = Number(unsanitizedBody.userId);
    if (isNaN(userId)) {
      return [["Valid user ID required"], null];
    }
    return [null, { userId }];
  },

  actionFunction: async ({ body }) => {
    const updated = await db.users.update(body.userId, { role: "admin" });
    if (updated) {
      return {
        status: 200,
        isSuccessful: true,
        actionResponseContent: {
          success: true,
          message: "User promoted to admin",
        },
      };
    } else {
      return {
        status: 400,
        isSuccessful: false,
        errors: ["User not found"],
      };
    }
  },
});

addActionRoute(router, "/users/make-admin", makeAdminHandler);
```

## API Reference

### Request Handler Factories

**Entity endpoints:**

- `getEntityWoAuth<Entity, FrontendEntity, Headers, Params, Context, OtherData, ID>`
- `getEntityWithAuth<User, Entity, FrontendEntity, Headers, Params, Context, OtherData, ID>`
- `updateEntityWoAuth<Entity, FrontendEntity, Headers, Params, Body, Context, OtherData, ID>`
- `updateEntityWithAuth<User, Entity, FrontendEntity, Headers, Params, Body, Context, OtherData, ID>`
- `deleteEntityWoAuth<Entity, FrontendEntity, Headers, Params, Context, OtherData, ID>`
- `deleteEntityWithAuth<User, Entity, FrontendEntity, Headers, Params, Context, OtherData, ID>`

**Singleton endpoints:**

- `getSingletonWoAuth<Entity, FrontendEntity, Headers, Params, Context, OtherData>`
- `getSingletonWithAuth<User, Entity, FrontendEntity, Headers, Params, Context, OtherData>`
- `updateSingletonWoAuth<Entity, FrontendEntity, Headers, Params, Body, Context, OtherData>`
- `updateSingletonWithAuth<User, Entity, FrontendEntity, Headers, Params, Body, Context, OtherData>`
- `deleteSingletonWoAuth<Entity, FrontendEntity, Headers, Params, Context, OtherData>`
- `deleteSingletonWithAuth<User, Entity, FrontendEntity, Headers, Params, Context, OtherData>`

**Collection endpoints:**

- `getCollectionWoAuth<Entity, FrontendEntity, Headers, Params, Context, OtherData>`
- `getCollectionWithAuth<User, Entity, FrontendEntity, Headers, Params, Context, OtherData>`

**Create endpoints:**

- `createWoAuth<Entity, FrontendEntity, Headers, Params, Body, Context, OtherData>`
- `createWithAuth<User, Entity, FrontendEntity, Headers, Params, Body, Context, OtherData>`

**Action endpoints:**

- `actionWoAuth<ActionResult, Headers, Params, Body, Context>`
- `actionWithAuth<User, ActionResult, Headers, Params, Body, Context>`

### Router Helpers

- `addGetEntityRoute(idParamName, router, path, handler)`
- `addGetCollectionRoute(router, path, handler)`
- `addGetSingletonRoute(router, path, handler)`
- `addCreateRoute(router, path, handler)`
- `addUpdateEntityRoute(idParamName, router, path, handler)`
- `addUpdateSingletonRoute(router, path, handler)`
- `addDeleteEntityRoute(idParamName, router, path, handler)`
- `addDeleteSingletonRoute(router, path, handler)`
- `addActionRoute(router, path, handler)`

## TypeScript Integration

Exprest provides full type safety when used with the `exprest-web-client`:

```typescript
// Shared types (exprest-shared or your own module)
export type User = { id: number; name: string; email: string };
export type UserResponse = { id: number; name: string };

// Server (this package)
const handler = getEntityWoAuth<User, UserResponse, {}, {}>({
  // Implementation ensures UserResponse matches convertToFrontEndEntityFunction return
});

// Client (exprest-web-client)
const client = new GetEntityClient<UserResponse>("/api/users");
const response = await client.fetch(123); // response.data.entity is typed as UserResponse
```

## Error Handling

Exprest handles errors consistently:

- **Validation errors** (400): From sanitize functions
- **Authentication errors** (401): When user required but not present
- **Not found errors** (404): When entity not found or invalid ID
- **Server errors** (500): Unhandled exceptions

All error responses follow the format: `{ errors: Array<string> }`

## License

ISC
