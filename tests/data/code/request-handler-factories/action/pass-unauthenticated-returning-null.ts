import { unauthenticatedActionRequestHandlerFactory } from "../../../../../src/request-handler-factories/action.js";

unauthenticatedActionRequestHandlerFactory<null, {}, {}>({
    contextCreateFunction: async () => ({}),
    sanitizeParamsFunction: async () => [null, {}],
    sanitizeBodyFunction: async () => [null, {}],
    actionFunction: async () => 
        ({ status: 200, isSuccessful: true, actionResponseContent: null }),
})