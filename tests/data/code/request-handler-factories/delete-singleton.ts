import {
    unauthenticatedResourceDeleteSingletonRequestHandlerFactory,
    authenticatedResourceDeleteSingletonRequestHandlerFactory
} from '../../../../src/request-handler-factories/delete-singleton.js';

// minimum required properties
unauthenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
unauthenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
    determineAuthorityToDeleteFunction: async () => [[], true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
unauthenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: () => [[], true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
unauthenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: async () => [[], true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
unauthenticatedResourceDeleteSingletonRequestHandlerFactory<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
unauthenticatedResourceDeleteSingletonRequestHandlerFactory<{hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
unauthenticatedResourceDeleteSingletonRequestHandlerFactory<
    {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});

// minimum required properties
authenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
authenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
    determineAuthorityToDeleteFunction: async () => [[], true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
authenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: () => [[], true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
authenticatedResourceDeleteSingletonRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: async () => [[], true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
authenticatedResourceDeleteSingletonRequestHandlerFactory<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
authenticatedResourceDeleteSingletonRequestHandlerFactory<{}, {hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
authenticatedResourceDeleteSingletonRequestHandlerFactory<
    {}, {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});
