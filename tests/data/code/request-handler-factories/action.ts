import { unauthenticatedActionRequestHandlerFactory } from "../../../../src/request-handler-factories/action.js";

// Trying to return empty object when declared to return null
unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        // @ts-expect-error
        ({}),
})

// Trying to return without status code when declared to return null
unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        // @ts-expect-error
        ({ isSuccessful: true, actionResponseContent: null }),
})

// Trying to return without status code when declared to return non-null
unauthenticatedActionRequestHandlerFactory<{ hello: string, }, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        // @ts-expect-error
        ({ isSuccessful: true, actionResponseContent: null }),
})

// Returning null
unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        ({ status: 200, isSuccessful: true, actionResponseContent: null }),
})

// Declared to return null, but tries returning something else
unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () =>
        // @ts-expect-error
        ({ status: 200, isSuccessful: true, actionResponseContent: {hello: "world"} }),
});

// Returning non-null value
unauthenticatedActionRequestHandlerFactory<{hello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        ({ status: 200, isSuccessful: true, actionResponseContent: {hello: "world"} }),
})

// Declared to return something else, but tries returning null
// This is a valid case, because we allow returning null when isSuccessful is true, e.g. for returning 204
// TODO: make status 204 the only case where null is allowed
unauthenticatedActionRequestHandlerFactory<{hello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () =>
        ({ status: 200, isSuccessful: true, actionResponseContent: null }),
});

// Return error when declared to return null
unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        ({ status: 400, isSuccessful: false, errors: ["error"] }),
})

// Return error when declared to return non-null
unauthenticatedActionRequestHandlerFactory<{hello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        ({ status: 400, isSuccessful: false, errors: ["error"] }),
})

// Attempting to return error and value when declared to return null
unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        // @ts-expect-error
        ({ status: 400, isSuccessful: false, errors: ["error"], actionResponseContent: null }),
})

// Attempting to return error and value when declared to return non-null
unauthenticatedActionRequestHandlerFactory<{hello: string}, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        // @ts-expect-error
        ({ status: 400, isSuccessful: false, errors: ["error"], actionResponseContent: {hello: "world"} }),
})

// Context function uses context type
unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({ hello: "world" }),
    // @ts-expect-error
    sanitizeParamsFunction: async ({context}) => [null, {hello: context.hello}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        ({ status: 200, isSuccessful: true, actionResponseContent: null }),
});

// Params function uses params type
unauthenticatedActionRequestHandlerFactory<null, {not: "this"}, {}, {hello: string}>({
    contextCreateFunction: async () => ({ hello: "world" }),
    // @ts-expect-error
    sanitizeParamsFunction: async ({context}) => [null, {hello: context.hello}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        ({ status: 200, isSuccessful: true, actionResponseContent: null }),
});
