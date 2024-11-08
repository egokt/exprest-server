import {
    deleteEntityWoAuth,
    deleteEntityWithAuth,
} from '../../../../src/request-handler-factories/delete-entity.js';

// minimum required properties
deleteEntityWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
deleteEntityWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
deleteEntityWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
deleteEntityWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
deleteEntityWoAuth<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
deleteEntityWoAuth<{hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
deleteEntityWoAuth<
    {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});

// minimum required properties
deleteEntityWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
deleteEntityWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
deleteEntityWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
deleteEntityWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
deleteEntityWithAuth<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
deleteEntityWithAuth<{}, {hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
deleteEntityWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});
