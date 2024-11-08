import {
    updateSingletonWoAuth,
    updateSingletonWithAuth,
} from "../../../../src/request-handler-factories/update-singleton.js";

// minimum required properties
updateSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// with all properties
updateSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
updateSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
updateSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
updateSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
updateSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
updateSingletonWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});

// authenticated - minimum required properties
updateSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// authenticated - with all properties
updateSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated - with all properties - non-async
updateSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated - with all properties - mixed async and non-async
updateSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated - with an entity
updateSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - with context
updateSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});

// authenticated - with other data
updateSingletonWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});
