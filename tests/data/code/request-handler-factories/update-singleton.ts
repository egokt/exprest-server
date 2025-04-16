import { UpdateSingletonWithAuthRequestHandlerFactory, UpdateSingletonWoAuthRequestHandlerFactory } from "exprest-shared";
import {
    updateSingletonWoAuth,
    updateSingletonWithAuth,
} from "../../../../src/request-handler-factories/update-singleton.js";

// unauthenticated - make sure that all types are correct
const updateSingletonWoAuthTestFunction: UpdateSingletonWoAuthRequestHandlerFactory<
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {bodyField: string},
    {context: string},
    {source: string}
> = updateSingletonWoAuth;
updateSingletonWoAuthTestFunction;

// minimum required properties
updateSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// with all properties
updateSingletonWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
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
    sanitizeHeadersFunction: () => [null, {}],
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
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// with an entity
updateSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
updateSingletonWoAuth<{hello: string}, {feHello: string}, {}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});

// with other data
updateSingletonWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});

// authenticated - make sure that all types are correct
const updateSingletonWithAuthTestFunction: UpdateSingletonWithAuthRequestHandlerFactory<
    {userField: string},
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {bodyField: string},
    {context: string},
    {source: string}
> = updateSingletonWithAuth;
updateSingletonWithAuthTestFunction;

// authenticated - minimum required properties
updateSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// authenticated - with all properties
updateSingletonWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
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
    sanitizeHeadersFunction: () => [null, {}],
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
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: () => [null, {}],
    updateEntityFunction: () => ({}),
    determineAuthorityToUpdateFunction: async () => [null, true],
    convertToFrontEndEntityFunction: () => ({}),
    otherDataValueOrFunction: async () => ({}),
    postExecutionFunction: () => {},
});

// authenticated - with an entity
updateSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - with context
updateSingletonWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});

// authenticated - with other data
updateSingletonWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
});
