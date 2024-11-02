import {
    unauthenticatedResourceGetCollectionRequestHandler,
    authenticatedResourceGetCollectionRequestHandler
} from "../../../../src/request-handler-factories/get-collection.js";

// minimum required properties
unauthenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
});

// with all properties
unauthenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
unauthenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
unauthenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
unauthenticatedResourceGetCollectionRequestHandler<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [{hello: 'world'}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
unauthenticatedResourceGetCollectionRequestHandler<{hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
unauthenticatedResourceGetCollectionRequestHandler<
    {hello: string}, {feHello: string}, {}, {context: string}, {otherStuff: string[]}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async ({context, entities}) => ({otherStuff: [context.context, entities[0].hello]}),
});

// authenticated with minimum required properties
authenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
});

// authenticated with all properties
authenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated with all properties - non-async
authenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with all properties - mixed async and non-async
authenticatedResourceGetCollectionRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with an entity
authenticatedResourceGetCollectionRequestHandler<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [{hello: 'world'}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with context
authenticatedResourceGetCollectionRequestHandler<{}, {hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with other data
authenticatedResourceGetCollectionRequestHandler<
    {}, {hello: string}, {feHello: string}, {}, {context: string}, {otherStuff: string[]}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async ({context, entities}) => ({otherStuff: [context.context, entities[0].hello]}),
});
