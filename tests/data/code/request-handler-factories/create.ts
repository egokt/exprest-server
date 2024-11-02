import {
    unauthenticatedResourceCreateSingletonRequestHandlerFactory
} from '../../../../src/request-handler-factories/create.js';

// minimum required properties
unauthenticatedResourceCreateSingletonRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({}),
});

// with all properties
unauthenticatedResourceCreateSingletonRequestHandlerFactory({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({}),
    determineAuthorityToCreateFunction: async () => [[], true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
unauthenticatedResourceCreateSingletonRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    createEntityFunction: () => ({}),
    determineAuthorityToCreateFunction: () => [[], true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
unauthenticatedResourceCreateSingletonRequestHandlerFactory({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    createEntityFunction: async () => ({}),
    determineAuthorityToCreateFunction: () => [[], true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: async () => {},
});

// with an entity
unauthenticatedResourceCreateSingletonRequestHandlerFactory<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
unauthenticatedResourceCreateSingletonRequestHandlerFactory<
    {hello: string}, {feHello: string}, {}, {}, {source: string}
>({
    contextCreateFunction: async () => ({source: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async ({context}) => ({hello: context.source}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
unauthenticatedResourceCreateSingletonRequestHandlerFactory<
    {hello: string}, {feHello: string}, {}, {}, {source: string}, {otherStuff: string[]}
>({
    contextCreateFunction: async () => ({source: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async ({context}) => ({hello: context.source}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async ({context, entity}) => ({otherStuff: [context.source, entity.hello]}),
});
