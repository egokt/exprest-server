import {
    unauthenticatedEntityUpdateRequestHandlerFactory,
    authenticatedEntityUpdateRequestHandlerFactory,
} from "../../../../src/request-handler-factories/update-entity.js";

// minimum required properties
unauthenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// with all properties
unauthenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
unauthenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
unauthenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
unauthenticatedEntityUpdateRequestHandlerFactory<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
unauthenticatedEntityUpdateRequestHandlerFactory<{hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
unauthenticatedEntityUpdateRequestHandlerFactory<
    {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - minimum required properties
authenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// authenticated - with all properties
authenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated - with all properties - non-async
authenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated - with all properties - mixed async and non-async
authenticatedEntityUpdateRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated - with an entity
authenticatedEntityUpdateRequestHandlerFactory<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - with context
authenticatedEntityUpdateRequestHandlerFactory<{}, {hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - with other data
authenticatedEntityUpdateRequestHandlerFactory<
    {}, {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

