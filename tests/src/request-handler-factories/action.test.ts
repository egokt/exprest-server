import { actionResponse } from "../../../src/helpers/action-response";
import { errorResponse } from "../../../src/helpers/error-response";
import { actionWithAuth, actionWoAuth } from "../../../src/request-handler-factories/action";
import { mockExpressResponse } from "../helpers";

describe("actionWoAuth", () => {
    it("should call contextCreateFunction", async () => {
        const contextCreateFunction = jest.fn().mockResolvedValue({});
        const handler = actionWoAuth({
            contextCreateFunction,
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        await handler({} as any, response as any);
        expect(contextCreateFunction).toHaveBeenCalled();
    });

    it("should call sanitizeHeadersFunction", async () => {
        const sanitizeHeadersFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction,
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        const headers = {"X-Something-Something": "something"}
        await handler({headers} as any, response as any);
        expect(sanitizeHeadersFunction).toHaveBeenCalledWith({context: {}, unsanitizedHeaders: headers});
    });

    it("should call sanitizeParamsFunction", async () => {
        const sanitizeParamsFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction,
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        await handler({} as any, response as any);
        expect(sanitizeParamsFunction).toHaveBeenCalled();
    });

    it("should call sanitizeBodyFunction", async () => {
        const sanitizeBodyFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction,
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        await handler({} as any, response as any);
        expect(sanitizeBodyFunction).toHaveBeenCalled();
    });

    it("should call actionFunction", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: null });
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        const { response } = mockExpressResponse();
        await handler({} as any, response as any);
        expect(actionFunction).toHaveBeenCalled();
    });

    it("should call postExecutionFunction", async () => {
        const postExecutionFunction = jest.fn();
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
            postExecutionFunction,
        });
        const { response } = mockExpressResponse();
        await handler({} as any, response as any);
        expect(postExecutionFunction).toHaveBeenCalled();
    });

    it("should return 200 with actionResponseContent", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: {hello: "world"} });
        const mockJsonFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
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
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
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
        const handler = actionWoAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
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

describe("actionWithAuth", () => {
    it("should fail if not authenticated", async () => {
        const mockStatusFunc = jest.fn().mockReturnValue({send: jest.fn()});
        const mockResponse = {status: mockStatusFunc}
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 204, isSuccessful: true, actionResponseContent: null }),
        });
        await handler({} as any, mockResponse as any);
        expect(mockStatusFunc).toHaveBeenCalledWith(401);
    });

    it("should call contextCreateFunction", async () => {
        const contextCreateFunction = jest.fn().mockResolvedValue({});
        const handler = actionWithAuth({
            contextCreateFunction,
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 204, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        await handler({user: {}} as any, response as any);
        expect(contextCreateFunction).toHaveBeenCalled();
    });

    it("should call sanitizeHeadersFunction", async () => {
        const sanitizeHeadersFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction,
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        await handler({user: {}} as any, response as any);
        expect(sanitizeHeadersFunction).toHaveBeenCalled();
    });

    it("should call sanitizeParamsFunction", async () => {
        const sanitizeParamsFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction,
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        await handler({user: {}} as any, response as any);
        expect(sanitizeParamsFunction).toHaveBeenCalled();
    });

    it("should call sanitizeBodyFunction", async () => {
        const sanitizeBodyFunction = jest.fn().mockResolvedValue([null, {}]);
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction,
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
        });
        const { response } = mockExpressResponse();
        await handler({user: {}} as any, response as any);
        expect(sanitizeBodyFunction).toHaveBeenCalled();
    });

    it("should call actionFunction", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: null });
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction,
        });
        const { response } = mockExpressResponse();
        await handler({user: {}} as any, response as any);
        expect(actionFunction).toHaveBeenCalled();
    });

    it("should call postExecutionFunction", async () => {
        const postExecutionFunction = jest.fn();
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
            sanitizeParamsFunction: () => [null, {}],
            sanitizeBodyFunction: () => [null, {}],
            actionFunction: () => ({ status: 200, isSuccessful: true, actionResponseContent: null }),
            postExecutionFunction,
        });
        const { response } = mockExpressResponse();
        await handler({user: {}} as any, response as any);
        expect(postExecutionFunction).toHaveBeenCalled();
    });

    it("should return 200 with actionResponseContent", async () => {
        const actionFunction =
            jest.fn().mockResolvedValue({ status: 200, isSuccessful: true, actionResponseContent: {hello: "world"} });
        const mockJsonFunc = jest.fn();
        const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc });
        const mockResponse = { status: mockStatusFunc };
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
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
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
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
        const handler = actionWithAuth({
            contextCreateFunction: () => ({}),
            sanitizeHeadersFunction: () => [null, {}],
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
