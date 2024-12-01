# What is Exprest?

Exprest is a framework for client and API communication. Exprest server is built on top of [express](https://expressjs.com/), which is in turn built on top of [node.js](https://nodejs.org/en).

Exprest:

* Uses HTTP idioms (get, put, post, delete).
* Uses CRUD for endpoint type abstractions.
* Provides a standard response structure for returning results, returning additional data with the results, and returning errors.
* Uses typescript to align the schema for the data communicated between the client and the API.
* Supports creating authenticated endpoints, by supporting express authentication middleware that sets the `user` attribute in the request parameter express provides to the request handler (such as [passport.js](https://www.passportjs.org/)).

Exprest currently has three parts:

* exprest-server (this): The API library.
* exprest-web-client: The web client library.
* exprest-shared: Types shared between exprest-server and exprest-web-client.

Exprest is mildly inspired by [RestLi](https://rest.li). Hat tip to my past colleagues. ;)

## API Abstractions

### Resource

A resource is an API entity identifiable by a URI, that contains a group of related endpoints.

Example: A resource that contains endpoints related to the "user" entity, with a url `example.local/users`.

Exprest uses the following resource types:

* **Singleton Resource**: A resource that serves a single entity, which does not need an identifier. For example: `example.local/logged-in-user` (because there can be only zero or one logged in user).
* **Collection Resource**: A resource that serves a set of entities each of which have a unique identifier. For example: `example.local/users` where each user have a unique id.

While these resource types are useful for understanding Exprest, Exprest currently doesn't define them as software artifacts (e.g. classes). Instead, it defines the endpoint types for them, such as getSingleton. Therefore, you can mix endpoints of two types to create a resource that is a mix of these resource types. Or you may create a resource that only have actions, which would neither be a singleton resource or a collection resource.

### Endpoint

An endpoint is a combination of a resource URI, an HTTP idiom, and a request handler.

Example: A user profile endpoint would consist of the resource URI `example.local/users`, HTTP idiom GET, and a request handler for returning the profile of the user with given id (more on ids later).

Exprest defines the following enpoint types:

* Endpoints that are primarily for collection resources:
  * **getEntity**: Returns a single entity with the given unique id, in the set of entities served by the collection resource.
  * **getCollection**: Returns multiple entities served by the collection resource. It may return all entities, a subset of all entities, or an empty set.
  * **deleteEntity**: Removes the entity with the given unique id from the collection.
  * **updateEntity**: Changes the entity with the given unique id in the collection.
* Endpoints that are primarily for singleton resources:
  * **getSingleton**: Returns the singleton entity of the resource.
  * **deleteSingleton**: Removes the singleton entity.
  * **updateSingleton**: Changes the singleton entity.
* Endpoints that can be used with both collection and singleton resources:
  * **create**: Creates an entity. If the entity is in a collection, it must be assigned a unique id when created.
  * **action**: An endpoint with flexible semantics. Actions can be used for many purposes, such as creating endpoints for modifying an entity in a particular way (e.g. a `make-admin` action).

# Implementing an Endpoint Using Exprest

There are two steps to implementing an endpoint using Exprest:

* Create an express request handler using Exprest's request handler factories,
* Add the request handler to the express router using Exprest's router helpers.

Each request handler factory is a generic typescript function which uses type parameters to align the necessary types for implementing an endpoint, such as the return type, query parameters type, query body type, etc.

A request handler factory takes a series of (possibly async) functions that separates the concerns related to implementing an endpoint, such as sanitizing query parameters and the body, retrieving the entity, converting backend entity to the frontend entity type, doing some post-execution work, etc. Each endpoint type forces the developer to be explicit about how the concerns relevant to that endpoint type are addressed, thereby increasing the reviewability of the code.

## GetEntity Endpoint

A getEntity endpoint use the HTTP Get idiom, the resource URI, and an id. For example:

```
GET https://example.local/users/1
```

In this example, http idiom is GET, the resource URI is `example.com/users` (or just `/users`), the id for the user the client is asking for is 1.

There are two methods that exprest provides for creating the express request handler for a get entity endpoint:

* getEntityWoAuth: Creates a request handler without authentication support.
* getEntityWithAuth: Creates a request handler with authentication support. It works the same way `getEntityWoAuth` works, but also checks if the user is authenticated and returns 401 otherwise.

Here is an example definition of a getEntity endpoint:

```js
type ContextType = {
    continent: string,
    season?: "summer" | "wet",
};

type QueryParamsType = {
    onlyFourLegged: boolean,
};

type BackendEntityType = {
    id: number,
    flies: boolean,
};

type FrontendEntityType = {
    id: number,
    flies: string,
};

const requestHandler = getEntityWoAuth<BackendEntityType, FrontendEntityType, QueryParamsType, ContextType>({

    contextCreateFunction: () => ({
        continent: "North America",
    }),

    sanitizeIdFunction: ({idParam}) => {
        const id = Number(idParam);
        if (!Number.isNaN(id)) {
            return [["Id parameter must be a number."], null];
        }
        return [null, id];
    },

    sanitizeParamsFunction: ({
        unsanitizedParams
    }) => {
        // check unsanitized params
        // then return a new sanitized params object
        if (unsanitizedParams["onlyFourLegged"] !== undefined
            && !["true", "false"].includes(unsanitizedParams["onlyFourLegged"])
        ) {
            // unable to sanitize
            return [["Valid values for onlyFourLegged parameter are true or false"], null];
        }
        const sanitizedParams = {
            onlyFourLegged = unsanitizedParams["onlyFourLegged"] === "true",
        };
        return [null, sanitizedParams];
    },

    retrieveEntityFunction: async ({submittedEntityId, params, context}) => {
        return await dataStore.find(
            submittedEntityId, params.onlyFourLegged, context.continent);
    },

    convertToFrontEndEntityFunction: ({entity}) => ({
        id: entity.id,
        flies: entity.flies ? "absolutely" : "nope",
    }),
});
```

Once you create the request handler, you can use the `addGetEntityRoute` router helper function to add the request handler to an express router:

```js
addGetEntityRoute("id", router, "/animals", requestHandler);
```

Here is the list of all type parameters for the `getEntityWoAuth` function:

* ENTITY: The type for the backend (stored) entity type that will be returned from the `retrieveEntityFunction`.
* FRONT_END_ENTITY: The type for the data returned to the client in the API response. It's also the type returned from the `convertToFrontEndEntityFunction`.
* SANITIZED_PARAMS: The type of the object that will contain the sanitized query params. It's the type returned from the `sanitizeParamsFunction`.
* CONTEXT: The type of the context data that is passed to each function. Each function can modify the context to pass data to other functions.
* OTHER_DATA: The type of the data that's going to be returned to the client in addition to the entity.

The functions passed to the request handler factory are called in the following order:

* contextCreateFunction
* sanitizeIdFunction
* sanitizeParamsFunction
* retrieveEntityFunction
* convertToFrontEndEntityFunction
* otherDataValueOrFunction
* postExecutionFunction

Here are the parameters available to these functions and what each function is meant to do:

* **contextCreateFunction()**: This funtion takes no arguments and returns a new context object. The reason why this is a function is because the context object may have required attributes, which means the context can't be initialized simply to an empty object (`{}`);
* **sanitizeIdFunction({ idParam })**: This function is for checking the submitted id value, and returning errors if any. If this function returns errors, other functions in the execution order are not called. The return value is either `[null, id]` where id is passed to the other functions as the `submittedEntityId` parameter, or `[[... an array of error strings ...], null]`, where the error strings are returned to the client as the value of the "errors" attribute in the API response.
* ... TO BE CONTINUED ...