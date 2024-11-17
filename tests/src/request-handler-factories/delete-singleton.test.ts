import { entityResponse } from '../../../src/helpers/entity-response';
import { deleteSingletonWoAuth, deleteSingletonWithAuth } from '../../../src/request-handler-factories/delete-singleton';
import { mockExpressResponse } from '../helpers';

describe('deleteSingletonWoAuth', () => {
    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWoAuth>();

        // Act
        const handler = deleteSingletonWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
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

    it("should return 400 if sanitizeParamsFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWoAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = deleteSingletonWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
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
    
    it("should return 403 if determineAuthorityToDeleteFunction returns false", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWoAuth>();
        props.determineAuthorityToDeleteFunction = jest.fn().mockReturnValue(['error', false]);

        // Act
        const handler = deleteSingletonWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof deleteSingletonWoAuth>();
        props.deleteEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = deleteSingletonWoAuth(props);
        const {response } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof deleteSingletonWoAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = deleteSingletonWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(204);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWoAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = deleteSingletonWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
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

describe('deleteSingletonWithAuth', () => {
    it("should return 401 if user is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWithAuth>();

        // Act
        const handler = deleteSingletonWithAuth(props);
        const { response } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(401);
        expect(props.contextCreateFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).not.toHaveBeenCalled();
        expect(props.deleteEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).not.toHaveBeenCalled();
    });

    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWithAuth>();

        // Act
        const handler = deleteSingletonWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
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

    it("should return 400 if sanitizeParamsFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWithAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = deleteSingletonWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
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
    
    it("should return 403 if determineAuthorityToDeleteFunction returns false", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWithAuth>();
        props.determineAuthorityToDeleteFunction = jest.fn().mockReturnValue(['error', false]);

        // Act
        const handler = deleteSingletonWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof deleteSingletonWithAuth>();
        props.deleteEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = deleteSingletonWithAuth(props);
        const {response } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof deleteSingletonWithAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = deleteSingletonWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToDeleteFunction).toHaveBeenCalled();
        expect(props.deleteEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(204);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof deleteSingletonWithAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = deleteSingletonWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
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



function defaultPropMock<FUNC extends typeof deleteSingletonWoAuth | typeof deleteSingletonWithAuth>(): Parameters<FUNC>[0] {
    return {
        contextCreateFunction: jest.fn(),
        sanitizeParamsFunction: jest.fn().mockReturnValue([null, {}]),
        determineAuthorityToDeleteFunction: jest.fn().mockReturnValue([null, true]),
        deleteEntityFunction: jest.fn().mockReturnValue({}),
        convertToFrontEndEntityFunction: jest.fn().mockReturnValue({}),
        otherDataValueOrFunction: jest.fn().mockReturnValue({}),
        postExecutionFunction: jest.fn()
    };
}
