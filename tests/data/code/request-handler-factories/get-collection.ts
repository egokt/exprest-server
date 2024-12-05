import {
    getCollectionWoAuth,
    getCollectionWithAuth,
} from "../../../../src/request-handler-factories/get-collection.js";

// minimum required properties
getCollectionWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
});

// with all properties
getCollectionWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
getCollectionWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
getCollectionWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
getCollectionWoAuth<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [{hello: 'world'}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
getCollectionWoAuth<{hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
getCollectionWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {context: string}, {otherStuff: string[]}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async ({context, entities}) => ({otherStuff: [context.context, entities[0].hello]}),
});

// authenticated with minimum required properties
getCollectionWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
});

// authenticated with all properties
getCollectionWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [],
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated with all properties - non-async
getCollectionWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with all properties - mixed async and non-async
getCollectionWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: () => [],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with an entity
getCollectionWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async () => [{hello: 'world'}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with context
getCollectionWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with other data
getCollectionWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {context: string}, {otherStuff: string[]}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityCollectionFunction: async ({context}) => [{hello: context.context}],
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async ({context, entities}) => ({otherStuff: [context.context, entities[0].hello]}),
});
