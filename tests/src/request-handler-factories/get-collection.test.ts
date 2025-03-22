import { collectionResponse } from "../../../src/helpers/collection-response";
import { getCollectionWithAuth, getCollectionWoAuth } from "../../../src/request-handler-factories/get-collection";
import { mockExpressResponse } from "../helpers";

describe("getCollectionWoAuth", () => {
    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWoAuth>();

        // Act
        const handler = getCollectionWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({query: { dummy: true, }} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(collectionResponse([{}], {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalledWith({ headers: {}, unsanitizedParams: { dummy: true } });
        expect(props.retrieveEntityCollectionFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entities).toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).toBeDefined();
    });

    it("should return 400 if sanitizeHeadersFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWoAuth>();
        props.sanitizeHeadersFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getCollectionWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityCollectionFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entities).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).not.toBeDefined();
    });

    it("should return 400 if sanitizeParamsFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWoAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getCollectionWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityCollectionFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entities).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).not.toBeDefined();
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWoAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = getCollectionWoAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(collectionResponse([{}]));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityCollectionFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entities).toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).toBeDefined();
    });
});

describe("getCollectionWithAuth", () => {
    it("should return 401 if user is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWithAuth>();

        // Act
        const handler = getCollectionWithAuth(props);
        const {response } = mockExpressResponse();
        await handler({params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(401);
        expect(props.contextCreateFunction).not.toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).not.toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityCollectionFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).not.toHaveBeenCalled();
    });

    it("should call all necessary functions", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWithAuth>();

        // Act
        const handler = getCollectionWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, query: { dummy: true, }} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(collectionResponse([{}], {}));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalledWith({ user: {}, headers: {}, unsanitizedParams: { dummy: true } });
        expect(props.retrieveEntityCollectionFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entities).toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).toBeDefined();
    });

    it("should return 400 if sanitizeHeadersFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWithAuth>();
        props.sanitizeHeadersFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getCollectionWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).not.toHaveBeenCalled();
        expect(props.retrieveEntityCollectionFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entities).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).not.toBeDefined();
    });

    it("should return 400 if sanitizeParamsFunction returns errors", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWithAuth>();
        props.sanitizeParamsFunction = jest.fn().mockReturnValue(['error', null]);

        // Act
        const handler = getCollectionWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(400);
        const responseContent = jsonFn.mock.calls[0][0];
        expect(responseContent).toHaveProperty('errors');
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityCollectionFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).not.toHaveBeenCalled();
        expect(props.otherDataValueOrFunction).not.toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(400);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(false);
        expect(postExecutionFunctionArgs.params).not.toBeDefined();
        expect(postExecutionFunctionArgs.entities).not.toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).not.toBeDefined();
    });

    it("should not return otherData if otherDataValueOrFunction is not provided", async () => {
        // Arrange
        const props = defaultPropMock<typeof getCollectionWithAuth>();
        props.otherDataValueOrFunction = undefined;

        // Act
        const handler = getCollectionWithAuth(props);
        const {response, jsonFn } = mockExpressResponse();
        await handler({user: {}, params: {}} as any, response as any);

        // Assert
        expect(response.status).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith(collectionResponse([{}]));
        expect(props.contextCreateFunction).toHaveBeenCalled();
        expect(props.sanitizeHeadersFunction).toHaveBeenCalled();
        expect(props.sanitizeParamsFunction).toHaveBeenCalled();
        expect(props.retrieveEntityCollectionFunction).toHaveBeenCalled();
        expect(props.convertToFrontEndEntityFunction).toHaveBeenCalled();
        expect(props.postExecutionFunction).toHaveBeenCalled();
        const postExecutionFunctionArgs = (props.postExecutionFunction as ReturnType<typeof jest.fn>).mock.calls[0][0];
        expect(postExecutionFunctionArgs.status).toBe(200);
        expect(postExecutionFunctionArgs.isSuccessful).toBe(true);
        expect(postExecutionFunctionArgs.params).toBeDefined();
        expect(postExecutionFunctionArgs.entities).toBeDefined();
        expect(postExecutionFunctionArgs.feEntities).toBeDefined();
    });
});

function defaultPropMock<FUNC extends typeof getCollectionWoAuth | typeof getCollectionWithAuth>(): Parameters<FUNC>[0] {
    return {
        contextCreateFunction: jest.fn(),
        sanitizeHeadersFunction: jest.fn().mockReturnValue([null, {}]),
        sanitizeParamsFunction: jest.fn().mockReturnValue([null, {}]),
        retrieveEntityCollectionFunction: jest.fn().mockReturnValue([{}]),
        convertToFrontEndEntityFunction: jest.fn().mockReturnValue({}),
        otherDataValueOrFunction: jest.fn().mockReturnValue({}),
        postExecutionFunction: jest.fn()
    };
}
