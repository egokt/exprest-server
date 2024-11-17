import { entityResponse } from "../../../src/helpers/entity-response";
import { updateSingletonWoAuth, updateSingletonWithAuth } from "../../../src/request-handler-factories/update-singleton";
import { mockExpressResponse } from "../helpers";

describe("updateSingletonWoAuth", () => {
    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWoAuth>();

        // Act
        const handler = updateSingletonWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });

    it("should return 400 if there are params errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWoAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateSingletonWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 400 if there are body errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWoAuth>();
        props.sanitizeBodyFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateSingletonWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 403 if determineAuthorityToUpdateFunction returns false", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWoAuth>();
        props.determineAuthorityToUpdateFunction = jest.fn().mockReturnValue([["Error"], false]);

        // Act
        const handler = updateSingletonWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(403);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 400 if createEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWoAuth>();
        props.updateEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = updateSingletonWoAuth(props);
        const { response } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 204 if convertToFrontEndEntityFunction is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWoAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = updateSingletonWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(204);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 200 without otherData if otherDataValueOrFunction is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWoAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = updateSingletonWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });
});

describe("updateSingletonWithAuth", () => {
    it("should return 401 if user is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response } = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(401);
        expect(props.contextCreateFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).not.toHaveBeenCalled();
    });

    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });

    it("should return 400 if there are params errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 400 if there are body errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();
        props.sanitizeBodyFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 403 if determineAuthorityToUpdateFunction returns false", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();
        props.determineAuthorityToUpdateFunction = jest.fn().mockReturnValue([["Error"], false]);

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(403);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 404 if createEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();
        props.updateEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response } = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 204 if convertToFrontEndEntityFunction is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(204);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 200 without otherData if otherDataValueOrFunction is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateSingletonWithAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = updateSingletonWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });
});


function defaultPropMock<FUNC extends typeof updateSingletonWoAuth | typeof updateSingletonWithAuth>(): Parameters<FUNC>[0] {
    return {
        contextCreateFunction: jest.fn(),
        sanitizeParamsFunction: jest.fn().mockReturnValue([null, {}]),
        sanitizeBodyFunction: jest.fn().mockReturnValue([null, {}]),
        determineAuthorityToUpdateFunction: jest.fn().mockReturnValue([null, true]),
        updateEntityFunction: jest.fn().mockReturnValue({}),
        convertToFrontEndEntityFunction: jest.fn().mockReturnValue({}),
        otherDataValueOrFunction: jest.fn().mockReturnValue({}),
        postExecutionFunction: jest.fn()
    };
}