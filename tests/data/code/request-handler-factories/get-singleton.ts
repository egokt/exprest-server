import {
    unauthenticatedResourceGetSingletonRequestHandler,
    authenticatedResourceGetSingletonRequestHandler,
} from "../../../../src/request-handler-factories/get-singleton.js";

// minimum required properties
unauthenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// with all properties
unauthenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
unauthenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
unauthenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
unauthenticatedResourceGetSingletonRequestHandler<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
unauthenticatedResourceGetSingletonRequestHandler<{hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
unauthenticatedResourceGetSingletonRequestHandler<
    {hello: string}, {feHello: string}, {}, {context: string}, {other: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({other: 'data'}),
});

// authenticated minimum required properties
authenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// authenticated with all properties
authenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated with all properties - non-async
authenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with all properties - mixed async and non-async
authenticatedResourceGetSingletonRequestHandler({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with an entity
authenticatedResourceGetSingletonRequestHandler<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with context
authenticatedResourceGetSingletonRequestHandler<{}, {hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with other data
authenticatedResourceGetSingletonRequestHandler<
    {}, {hello: string}, {feHello: string}, {}, {context: string}, {other: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({other: 'data'}),
});

