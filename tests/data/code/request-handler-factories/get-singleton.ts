import {
    getSingletonWoAuth,
    getSingletonWithAuth,
} from "../../../../src/request-handler-factories/get-singleton.js";

// minimum required properties
getSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// with all properties
getSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
getSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
getSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
getSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
getSingletonWoAuth<{hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
getSingletonWoAuth<
    {hello: string}, {feHello: string}, {}, {context: string}, {other: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({other: 'data'}),
});

// authenticated minimum required properties
getSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// authenticated with all properties
getSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated with all properties - non-async
getSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with all properties - mixed async and non-async
getSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with an entity
getSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with context
getSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with other data
getSingletonWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {context: string}, {other: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({other: 'data'}),
});

