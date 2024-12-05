import { entityResponse } from "../../../src/helpers/entity-response";
import { updateEntityWoAuth, updateEntityWithAuth } from "../../../src/request-handler-factories/update-entity";
import { mockExpressResponse } from "../helpers";

describe("updateEntityWoAuth", () => {
    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWoAuth>();

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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

    it("should return 404 if entity parameter is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.updateEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 404 if sanitizeIdFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.sanitizeIdFunction = jest.fn().mockReturnValue([['error'], null]);

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 400 if there are headers errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.sanitizeHeadersFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
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

    it("should return 400 if there are params errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.sanitizeBodyFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.determineAuthorityToUpdateFunction = jest.fn().mockReturnValue([["Error"], false]);

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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

    it("should return 404 if updateEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.updateEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = updateEntityWoAuth(props);
        const { response } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 204 if convertToFrontEndEntityFunction is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof updateEntityWoAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = updateEntityWoAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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

describe("updateEntityWithAuth", () => {
    it("should return 401 if user is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWithAuth>();

        // Act
        const handler = updateEntityWithAuth(props);
        const { response } = mockExpressResponse();
        await handler({params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(401);
        expect(props.contextCreateFunction).not.toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
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
        const props = defaultPropMock<typeof updateEntityWithAuth>();

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}, {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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

    it("should return 404 if entity parameter is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.updateEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).not.toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 404 if sanitizeIdFunction returns an error", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.sanitizeIdFunction = jest.fn().mockReturnValue([['error'], null]);

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeIdFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).not.toHaveBeenCalled();
        expect(props.updateEntityFunction).not.toHaveBeenCalled
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
    });

    it("should return 400 if there are headers errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.sanitizeHeadersFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
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

    it("should return 400 if there are params errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.sanitizeBodyFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.determineAuthorityToUpdateFunction = jest.fn().mockReturnValue([["Error"], false]);

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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

    it("should return 404 if updateEntityFunction returns null", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.updateEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = updateEntityWithAuth(props);
        const { response } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        // we don't return error reasons in this case: see https://github.com/egokt/exprest-server/issues/10
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToUpdateFunction).toHaveBeenCalled();
        expect(props.updateEntityFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(404);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 204 if convertToFrontEndEntityFunction is not defined", async () => {
        // Arrange
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(jsonFn).not.toHaveBeenCalled();
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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
        const props = defaultPropMock<typeof updateEntityWithAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = updateEntityWithAuth(props);
        const { response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {id: 1}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(entityResponse({}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
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


function defaultPropMock<FUNC extends typeof updateEntityWoAuth | typeof updateEntityWithAuth>(): Parameters<FUNC>[0] {
    return {
        idParamName: 'id',
        sanitizeIdFunction: jest.fn().mockReturnValue([null, 1]),
        contextCreateFunction: jest.fn(),
        sanitizeHeadersFunction: jest.fn().mockReturnValue([null, {}]),
        sanitizeParamsFunction: jest.fn().mockReturnValue([null, {}]),
        sanitizeBodyFunction: jest.fn().mockReturnValue([null, {}]),
        determineAuthorityToUpdateFunction: jest.fn().mockReturnValue([null, true]),
        updateEntityFunction: jest.fn().mockReturnValue({}),
        convertToFrontEndEntityFunction: jest.fn().mockReturnValue({}),
        otherDataValueOrFunction: jest.fn().mockReturnValue({}),
        postExecutionFunction: jest.fn()
    };
}
