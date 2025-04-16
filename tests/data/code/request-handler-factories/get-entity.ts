import { GetEntityWithAuthRequestHandlerFactory, GetEntityWoAuthRequestHandlerFactory } from "exprest-shared";
import {
    getEntityWoAuth,
    getEntityWithAuth,
} from "../../../../src/request-handler-factories/get-entity.js";

// unauthenticated - make sure that all types are correct
const getEntityWoAuthTestFunction: GetEntityWoAuthRequestHandlerFactory<
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {context: string},
    {source: string},
    string
> = getEntityWoAuth;
getEntityWoAuthTestFunction;

// minimum required properties
getEntityWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// with all properties
getEntityWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
getEntityWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
getEntityWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
getEntityWoAuth<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
getEntityWoAuth<{hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
getEntityWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({source: 'db'}),
});

// authenticated - make sure that all types are correct
const getEntityWithAuthTestFunction: GetEntityWithAuthRequestHandlerFactory<
    {userField: string},
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {context: string},
    {source: string},
    string
> = getEntityWithAuth;
getEntityWithAuthTestFunction;

// authenticated minimum required properties
getEntityWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// authenticated with all properties
getEntityWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated with all properties - non-async
getEntityWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with all properties - mixed async and non-async
getEntityWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with an entity
getEntityWithAuth<{}, {hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with context
getEntityWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with other data
getEntityWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({source: 'db'}),
});
