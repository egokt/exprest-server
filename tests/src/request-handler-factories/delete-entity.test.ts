import { entityResponse } from "../../../src/helpers/entity-response";
import { deleteEntityWoAuth, deleteEntityWithAuth } from "../../../src/request-handler-factories/delete-entity";
import { mockExpressResponse } from "../helpers";

describe("deleteEntityWoAuth", () => {
    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWoAuth>();

        // Act
        const handler = deleteEntityWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof deleteEntityWoAuth>();
        props.deleteEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = deleteEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 404 if sanitizeIdFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWoAuth>();
        props.sanitizeIdFunction = jest.fn().mockReturnValue([['error'], null]);

        // Act
        const handler = deleteEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 400 if sanitizeParamsFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWoAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([['error'], null]);

        // Act
        const handler = deleteEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
    });

    it("should return 403 if determineAuthorityToDeleteFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWoAuth>();
        props.determineAuthorityToDeleteFunction = jest.fn().mockReturnValue([['error'], false]);

        // Act
        const handler = deleteEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(403);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).toBeDefined();
    });

    it("should return 404 if deleteEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWoAuth>();
        props.deleteEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = deleteEntityWoAuth(props);
        const { response } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).toBeDefined();
    });

    it("should return 204 if convertToFrontEndEntityFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWoAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = deleteEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(204);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).toBeDefined();
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWoAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = deleteEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
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

describe("deleteEntityWithAuth", () => {
    it("should return 401 if user is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(401);
        expect(props.contextCreateFunction).not.toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).not.toHaveBeenCalled();
    });

    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof deleteEntityWithAuth>();
        props.deleteEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 404 if sanitizeIdFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();
        props.sanitizeIdFunction = jest.fn().mockReturnValue([['error'], null]);

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 400 if sanitizeParamsFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([['error'], null]);

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
    });

    it("should return 403 if determineAuthorityToDeleteFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();
        props.determineAuthorityToDeleteFunction = jest.fn().mockReturnValue([['error'], false]);

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(403);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).toBeDefined();
    });

    it("should return 404 if deleteEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();
        props.deleteEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).toBeDefined();
    });

    it("should return 204 if convertToFrontEndEntityFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(204);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entity).toBeDefined();
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteEntityWithAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = deleteEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
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


function defaultPropMock<FUNC extends typeof deleteEntityWoAuth | typeof deleteEntityWithAuth>(): Parameters<FUNC>[0] {
    return {
        sanitizeIdFunction: jest.fn().mockReturnValue([null, 1]),
        idParamName: 'id',
        contextCreateFunction: jest.fn(),
        sanitizeParamsFunction: jest.fn().mockReturnValue([null, {}]),
        determineAuthorityToDeleteFunction: jest.fn().mockReturnValue([null, true]),
        deleteEntityFunction: jest.fn().mockReturnValue({}),
        convertToFrontEndEntityFunction: jest.fn().mockReturnValue({}),
        otherDataValueOrFunction: jest.fn().mockReturnValue({}),
        postExecutionFunction: jest.fn()
    };
}
