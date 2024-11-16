import { createWoAuth, createWithAuth } from "../../../src/request-handler-factories/create";
import { mockExpressResponse } from "../helpers";

describe("createWoAuth", () => {
    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock();

        // Act
        const handler = createWoAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = createWoAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).not.toHaveBeenCalled();
        expect(props.createEntityFunction).not.toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.sanitizeBodyFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = createWoAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).not.toHaveBeenCalled();
        expect(props.createEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 403 if determineAuthorityToCreateFunction returns false", async () => {
        // Arrange
        const props = defaultPropMock();
        props.determineAuthorityToCreateFunction = jest.fn().mockReturnValue([["Error"], false]);

        // Act
        const handler = createWoAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).not.toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.createEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = createWoAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = createWoAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = createWoAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });
});

describe("createWithAuth", () => {
    it("should return 401 if user is not defined", async () => {
        // Arrange
        const props = defaultPropMock();

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(401);
        expect(props.contextCreateFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).not.toHaveBeenCalled();
        expect(props.createEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).not.toHaveBeenCalled();
    });

    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock();

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).not.toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).not.toHaveBeenCalled();
        expect(props.createEntityFunction).not.toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.sanitizeBodyFunction = jest.fn().mockReturnValue([["Error"], null]);

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).not.toHaveBeenCalled();
        expect(props.createEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.entity).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).not.toBeDefined();
    });

    it("should return 403 if determineAuthorityToCreateFunction returns false", async () => {
        // Arrange
        const props = defaultPropMock();
        props.determineAuthorityToCreateFunction = jest.fn().mockReturnValue([["Error"], false]);

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(403);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).not.toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.createEntityFunction = jest.fn().mockReturnValue(null);

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.convertToFrontEndEntityFunction = undefined;

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(204);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
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
        const props = defaultPropMock();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = createWithAuth(props);
        const response = mockExpressResponse();
        await handler({user: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.sanitizeBodyFunction).toHaveBeenCalled();
        expect(props.createEntityFunction).toHaveBeenCalled();
        expect(props.determineAuthorityToCreateFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.entity).toBeDefined();
        expect(postExecutionFunctionArgs.feEntity).toBeDefined();
    });
});


function defaultPropMock(): Parameters<typeof createWoAuth>[0] {
    return {
        contextCreateFunction: jest.fn(),
        sanitizeParamsFunction: jest.fn().mockReturnValue([null, {}]),
        sanitizeBodyFunction: jest.fn().mockReturnValue([null, {}]),
        createEntityFunction: jest.fn().mockReturnValue({}),
        determineAuthorityToCreateFunction: jest.fn().mockReturnValue([null, true]),
        convertToFrontEndEntityFunction: jest.fn().mockReturnValue({}),
        otherDataValueOrFunction: jest.fn().mockReturnValue({}),
        postExecutionFunction: jest.fn()
    };
}