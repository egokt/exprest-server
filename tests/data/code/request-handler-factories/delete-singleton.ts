import {
    deleteSingletonWoAuth,
    deleteSingletonWithAuth,
} from '../../../../src/request-handler-factories/delete-singleton.js';

// minimum required properties
deleteSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
deleteSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
deleteSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
deleteSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
deleteSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
deleteSingletonWoAuth<{hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
deleteSingletonWoAuth<
    {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});

// minimum required properties
deleteSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
deleteSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
deleteSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
deleteSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: () => ({}),
    determineAuthorityToDeleteFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
deleteSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
deleteSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
deleteSingletonWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});
