import { actionResponse } from "../../../src/helpers/action-response";
import { errorResponse } from "../../../src/helpers/error-response";
import { authenticatedActionRequestHandlerFactory, unauthenticatedActionRequestHandlerFactory } from "../../../src/request-handler-factories/action";
import { mockExpressResponse } from "../helpers";

describe("unauthenticatedActionRequestHandlerFactory", () => {
    it("should call contextCreateFunction", async () => {
        const contextCreateFunction = jest.fn().mockResolvedValue({});
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction,
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({} as any, mockExpressResponse() as any);
        expect(contextCreateFunction).toHaveBeenCalled();
    });

    it("should call sanitizeParamsFunction", async () => {
        const sanitizeParamsFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction,
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({} as any, mockExpressResponse() as any);
        expect(sanitizeParamsFunction).toHaveBeenCalled();
    });

    it("should call sanitizeBodyFunction", async () => {
        const sanitizeBodyFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction,
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({} as any, mockExpressResponse() as any);
        expect(sanitizeBodyFunction).toHaveBeenCalled();
    });

    it("should call actionFunction", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: null });
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({} as any, mockExpressResponse() as any);
        expect(actionFunction).toHaveBeenCalled();
    });

    it("should call postExecutionFunction", async () => {
        const postExecutionFunction = jest.fn();
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
            postExecutionFunction,
        });
        await handler({} as any, mockExpressResponse() as any);
        expect(postExecutionFunction).toHaveBeenCalled();
    });

    it("should return 200 with actionResponseContent", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: {hello: "world"} });
        const mockJsonFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({} as any, mockResponse as any);
        expect(actionFunction).toHaveBeenCalled();
        expect(mockStatusFunc).toHaveBeenCalledWith(200);
        expect(mockJsonFunc).toHaveBeenCalledWith(actionResponse({ hello: "world" }));
    });

    it("should return 204 when actionResponseContent is null", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 204, isSuccessful: true, actionResponseContent: null });
        const mockJsonFunc = jest.fn();
        const mockEndFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc, end: mockEndFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({} as any, mockResponse as any);
        expect(actionFunction).toHaveBeenCalled();
        expect(mockStatusFunc).toHaveBeenCalledWith(204);
        expect(mockJsonFunc).not.toHaveBeenCalled();
        expect(mockEndFunc).toHaveBeenCalled();
    });

    it("should return errorResponse when not isSuccessful", async () => {
        const errors = ['error'];
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 400, isSuccessful: false, errors });
        const mockJsonFunc = jest.fn();
        const mockEndFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc, end: mockEndFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = unauthenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({} as any, mockResponse as any);
        expect(actionFunction).toHaveBeenCalled();
        expect(mockStatusFunc).toHaveBeenCalledWith(400);
        expect(mockJsonFunc).toHaveBeenCalledWith(errorResponse(errors));
        expect(mockEndFunc).not.toHaveBeenCalled();
    });
});

describe("authenticatedActionRequestHandlerFactory", () => {
    it("should fail if not authenticated", async () => {
        const mockStatusFunc = jest.fn().mockReturnValue({send: jest.fn()});
        const mockResponse = {status: mockStatusFunc}
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 204, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({} as any, mockResponse as any);
        expect(mockStatusFunc).toHaveBeenCalledWith(401);
    });

    it("should call contextCreateFunction", async () => {
        const contextCreateFunction = jest.fn().mockResolvedValue({});
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction,
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 204, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({user: {}} as any, mockExpressResponse() as any);
        expect(contextCreateFunction).toHaveBeenCalled();
    });

    it("should call sanitizeParamsFunction", async () => {
        const sanitizeParamsFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction,
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({user: {}} as any, mockExpressResponse() as any);
        expect(sanitizeParamsFunction).toHaveBeenCalled();
    });

    it("should call sanitizeBodyFunction", async () => {
        const sanitizeBodyFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction,
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({user: {}} as any, mockExpressResponse() as any);
        expect(sanitizeBodyFunction).toHaveBeenCalled();
    });

    it("should call actionFunction", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: null });
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({user: {}} as any, mockExpressResponse() as any);
        expect(actionFunction).toHaveBeenCalled();
    });

    it("should call postExecutionFunction", async () => {
        const postExecutionFunction = jest.fn();
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
            postExecutionFunction,
        });
        await handler({user: {}} as any, mockExpressResponse() as any);
        expect(postExecutionFunction).toHaveBeenCalled();
    });

    it("should return 200 with actionResponseContent", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: {hello: "world"} });
        const mockJsonFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({user: {}} as any, mockResponse as any);
        expect(actionFunction).toHaveBeenCalled();
        expect(mockStatusFunc).toHaveBeenCalledWith(200);
        expect(mockJsonFunc).toHaveBeenCalledWith(actionResponse({ hello: "world" }));
    });

    it("should return 204 when actionResponseContent is null", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 204, isSuccessful: true, actionResponseContent: null });
        const mockJsonFunc = jest.fn();
        const mockEndFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc, end: mockEndFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({user: {}} as any, mockResponse as any);
        expect(actionFunction).toHaveBeenCalled();
        expect(mockStatusFunc).toHaveBeenCalledWith(204);
        expect(mockJsonFunc).not.toHaveBeenCalled();
        expect(mockEndFunc).toHaveBeenCalled();
    });

    it("should return errorResponse when not isSuccessful", async () => {
        const errors = ['error'];
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 400, isSuccessful: false, errors });
        const mockJsonFunc = jest.fn();
        const mockEndFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc, end: mockEndFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = authenticatedActionRequestHandlerFactory({
            contextCreateFunction: () => ({}),
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        await handler({user: {}} as any, mockResponse as any);
        expect(actionFunction).toHaveBeenCalled();
        expect(mockStatusFunc).toHaveBeenCalledWith(400);
        expect(mockJsonFunc).toHaveBeenCalledWith(errorResponse(errors));
        expect(mockEndFunc).not.toHaveBeenCalled();
    });
});
