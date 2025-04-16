import { GetSingletonWithAuthRequestHandlerFactory, GetSingletonWoAuthRequestHandlerFactory } from "exprest-shared";
import {
    getSingletonWoAuth,
    getSingletonWithAuth,
} from "../../../../src/request-handler-factories/get-singleton.js";

// unauthenticated - make sure that all types are correct
const getSingletonWoAuthTestFunction: GetSingletonWoAuthRequestHandlerFactory<
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {context: string},
    {source: string}
> = getSingletonWoAuth;
getSingletonWoAuthTestFunction;

// minimum required properties
getSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// with all properties
getSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// with all properties - non-async
getSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// with all properties - mixed async and non-async
getSingletonWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
getSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
getSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
getSingletonWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {context: string}, {other: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({other: 'data'}),
});

// authenticated - make sure that all types are correct
const getSingletonWithAuthTestFunction: GetSingletonWithAuthRequestHandlerFactory<
    {userField: string},
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {context: string},
    {source: string}
> = getSingletonWithAuth;
getSingletonWithAuthTestFunction;

// authenticated minimum required properties
getSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
});

// authenticated with all properties
getSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({}),
    convertToFrontEndEntityFunction: async () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: async () => {},
});

// authenticated with all properties - non-async
getSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: () => [null, {}],
    sanitizeParamsFunction: () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with all properties - mixed async and non-async
getSingletonWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: () => ({}),
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated with an entity
getSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with context
getSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated with other data
getSingletonWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {context: string}, {other: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    retrieveEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
    otherDataValueOrFunction: async () => ({other: 'data'}),
});
