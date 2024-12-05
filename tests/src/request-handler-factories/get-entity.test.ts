import { entityResponse } from "../../../src/helpers/entity-response";
import { getEntityWoAuth, getEntityWithAuth } from "../../../src/request-handler-factories/get-entity";
import { mockExpressResponse } from "../helpers";

describe("getEntityWoAuth", () => {
    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWoAuth>();

        // Act
        const handler = getEntityWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });

    it("should return 404 if entity parameter is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWoAuth>();
        props.retrieveEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = getEntityWoAuth(props);
        const {response } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 404 if sanitizeIdFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWoAuth>();
        props.sanitizeIdFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getEntityWoAuth(props);
        const {response } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 400 if sanitizeHeadersFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWoAuth>();
        props.sanitizeHeadersFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getEntityWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 400 if sanitizeParamsFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWoAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getEntityWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 404 if retrieveEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWoAuth>();
        props.retrieveEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = getEntityWoAuth(props);
        const {response } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWoAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = getEntityWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });
});

describe("getEntityWithAuth", () => {
    it("should return 401 if user is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();

        // Act
        const handler = getEntityWithAuth(props);
        const {response } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(401);
        expect(props.contextCreateFunction).not.toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).not.toHaveBeenCalled();
    });

    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();

        // Act
        const handler = getEntityWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });

    it("should return 404 if entity parameter is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();
        props.retrieveEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = getEntityWithAuth(props);
        const {response } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 404 if sanitizeIdFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();
        props.sanitizeIdFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getEntityWithAuth(props);
        const {response } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 400 if sanitizeHeadersFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();
        props.sanitizeHeadersFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getEntityWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 400 if sanitizeParamsFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getEntityWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 404 if retrieveEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();
        props.retrieveEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = getEntityWithAuth(props);
        const {response } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getEntityWithAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = getEntityWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityFunction).toHaveBeenCalled
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });
});

function defaultPropMock<FUNC extends typeof getEntityWoAuth | typeof getEntityWithAuth>(): Parameters<FUNC>[0] {
    return {
        sanitizeIdFunction: jest.fn().mockReturnValue([null, 1]),
        idParamName: 'id',
        contextCreateFunction: jest.fn(),
        sanitizeHeadersFunction: jest.fn().mockReturnValue([null, {}]),
        sanitizeParamsFunction: jest.fn().mockReturnValue([null, {}]),
        retrieveEntityFunction: jest.fn().mockReturnValue({}),
        convertToFrontEndEntityFunction: jest.fn().mockReturnValue({}),
        otherDataValueOrFunction: jest.fn().mockReturnValue({}),
        postExecutionFunction: jest.fn()
    };
}
