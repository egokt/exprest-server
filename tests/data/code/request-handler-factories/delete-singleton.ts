import { DeleteSingletonWithAuthRequestHandlerFactory, DeleteSingletonWoAuthRequestHandlerFactory } from 'exprest-shared';
import {
    deleteSingletonWoAuth,
    deleteSingletonWithAuth,
} from '../../../../src/request-handler-factories/delete-singleton.js';

// unauthenticated - make sure that all types are correct
const deleteSingletonWoAuthTestFunction: DeleteSingletonWoAuthRequestHandlerFactory<
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {context: string},
    {source: string}
> = deleteSingletonWoAuth;
deleteSingletonWoAuthTestFunction;

// minimum required properties
deleteSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
deleteSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
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
    sanitizeHeadersFunction: () => [null, {}],
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
    sanitizeHeadersFunction: async () => [null, {}],
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
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
deleteSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
deleteSingletonWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});

// authenticated - make sure that all types are correct
const deleteSingletonWithAuthTestFunction: DeleteSingletonWithAuthRequestHandlerFactory<
    {userField: string},
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {context: string},
    {source: string}
> = deleteSingletonWithAuth;
deleteSingletonWithAuthTestFunction;

// minimum required properties
deleteSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({}),
});

// with all properties
deleteSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
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
    sanitizeHeadersFunction: () => [null, {}],
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
    sanitizeHeadersFunction: async () => [null, {}],
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
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
deleteSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
deleteSingletonWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    deleteEntityFunction: async ({context}) => ({hello: context.context}),
    otherDataValueOrFunction: async () => ({source: 'world'}),
});
