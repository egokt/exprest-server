import {
    unauthenticatedEntityGetRequestHandlerFactory,
    authenticatedEntityGetRequestHandlerFactory
} from "../../../../src/request-handler-factories/get-entity.js";

// minimum required properties
unauthenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// with all properties
unauthenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
unauthenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
unauthenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
unauthenticatedEntityGetRequestHandlerFactory<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
unauthenticatedEntityGetRequestHandlerFactory<{hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
unauthenticatedEntityGetRequestHandlerFactory<
    {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({source: 'db'}),
});

// authenticated minimum required properties
authenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// authenticated with all properties
authenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated with all properties - non-async
authenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with all properties - mixed async and non-async
authenticatedEntityGetRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with an entity
authenticatedEntityGetRequestHandlerFactory<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with context
authenticatedEntityGetRequestHandlerFactory<{}, {hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with other data
authenticatedEntityGetRequestHandlerFactory<
    {}, {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({source: 'db'}),
});
