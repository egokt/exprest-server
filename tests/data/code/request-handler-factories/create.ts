import {
    createWoAuth,
    createWithAuth,
} from '../../../../src/request-handler-factories/create.js';

// minimum required properties
createWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({}),
});

// with all properties
createWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({}),
    determineAuthorityToCreateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
createWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    createEntityFunction: () => ({}),
    determineAuthorityToCreateFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
createWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    createEntityFunction: async () => ({}),
    determineAuthorityToCreateFunction: () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: async () => {},
});

// with an entity
createWoAuth<{hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
createWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {}, {source: string}
>({
    contextCreateFunction: async () => ({source: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async ({context}) => ({hello: context.source}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
createWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {}, {source: string}, {otherStuff: string[]}
>({
    contextCreateFunction: async () => ({source: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async ({context}) => ({hello: context.source}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async ({context, entity}) => ({otherStuff: [context.source, entity.hello]}),
});

// minimum required properties
createWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({}),
});

// with all properties
createWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({}),
    determineAuthorityToCreateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
createWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    createEntityFunction: () => ({}),
    determineAuthorityToCreateFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
createWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    createEntityFunction: async () => ({}),
    determineAuthorityToCreateFunction: () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: async () => {},
});

// with an entity
createWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
createWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {}, {source: string}
>({
    contextCreateFunction: async () => ({source: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async ({context}) => ({hello: context.source}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
createWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {}, {source: string}, {otherStuff: string[]}
>({
    contextCreateFunction: async () => ({source: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    createEntityFunction: async ({context}) => ({hello: context.source}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async ({context, entity}) => ({otherStuff: [context.source, entity.hello]}),
});
