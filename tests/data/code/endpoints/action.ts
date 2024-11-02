import { ActionEndpoint } from "../../../../src/endpoints/action.js";
import { unauthenticatedActionRequestHandlerFactory } from "../../../../src/request-handler-factories/action.js";

// An array of endpoints for testing
const testEndpoints = [
    // with empty body and params
    new ActionEndpoint<{}, {}>({
        routerMountRelativePath: "/test",
        requestHandler: unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => ([null, {}]),
            sanitizeBodyFunction: () => ([null, {}]),
            actionFunction: () => ({
                status: 200,
                isSuccessful: true,
                actionResponseContent: null,
            }),
        }),
    }),

    // with default types
    new ActionEndpoint({
        routerMountRelativePath: "/test",
        requestHandler: unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => ([null, {}]),
            sanitizeBodyFunction: () => ([null, {}]),
            actionFunction: () => ({
                status: 200,
                isSuccessful: true,
                actionResponseContent: null,
            }),
        }),
    }),

    // with null response body
    new ActionEndpoint({
        routerMountRelativePath: "/test",
        requestHandler: unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => ([null, {}]),
            sanitizeBodyFunction: () => ([null, {}]),
            actionFunction: () => ({
                status: 200,
                isSuccessful: true,
                actionResponseContent: null,
            }),
        }),
    }),
];

// just to get rid of unused error
testEndpoints[0];
