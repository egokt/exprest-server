import { UpdateEntityWithAuthRequestHandlerFactory, UpdateEntityWoAuthRequestHandlerFactory } from "exprest-shared";
import {
    updateEntityWoAuth,
    updateEntityWithAuth,
} from "../../../../src/request-handler-factories/update-entity.js";

// unauthenticated - make sure that all types are correct
const updateEntityWoAuthTestFunction: UpdateEntityWoAuthRequestHandlerFactory<
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {bodyField: string},
    {context: string},
    {source: string},
    string
> = updateEntityWoAuth;
updateEntityWoAuthTestFunction;

// minimum required properties
updateEntityWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// with all properties
updateEntityWoAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
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
updateEntityWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
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
updateEntityWoAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
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
updateEntityWoAuth<{hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with context
updateEntityWoAuth<{hello: string}, {feHello: string}, {}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// with other data
updateEntityWoAuth<
    {hello: string}, {feHello: string}, {}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - make sure that all types are correct
const updateEntityWithAuthTestFunction: UpdateEntityWithAuthRequestHandlerFactory<
    {},
    {hello: string},
    {feHello: string},
    {headerField: string},
    {paramField: string},
    {bodyField: string},
    {context: string},
    {source: string},
    string
> = updateEntityWithAuth;
updateEntityWithAuthTestFunction;

// authenticated - minimum required properties
updateEntityWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({}),
});

// authenticated - with all properties
updateEntityWithAuth({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
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
updateEntityWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
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
updateEntityWithAuth({
    contextCreateFunction: () => ({}),
    sanitizeIdFunction: () => [null, 1],
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
updateEntityWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async () => ({hello: 'world'}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - with context
updateEntityWithAuth<{}, {hello: string}, {feHello: string}, {}, {}, {}, {context: string}>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - with other data
updateEntityWithAuth<
    {}, {hello: string}, {feHello: string}, {}, {}, {}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {}],
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

// authenticated - with all types
updateEntityWithAuth<
    {}, {hello: string}, {feHello: string}, {headerField: string}, {paramField: string}, {bodyField: string}, {context: string}, {source: string}
>({
    contextCreateFunction: async () => ({context: 'world'}),
    sanitizeIdFunction: () => [null, 1],
    sanitizeHeadersFunction: async () => [null, {headerField: 'headerValue'}],
    sanitizeParamsFunction: async () => [null, {paramField: 'paramValue'}],
    sanitizeBodyFunction: async () => [null, {bodyField: 'bodyValue'}],
    updateEntityFunction: async ({context}) => ({hello: context.context}),
    convertToFrontEndEntityFunction: async ({entity}) => ({feHello: entity.hello}),
});

