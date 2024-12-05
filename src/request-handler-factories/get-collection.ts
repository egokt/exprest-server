import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from "./request-handler-helpers.js";
import { collectionResponse } from "../helpers/collection-response.js";
import {
    GetCollectionRequestHandlerFunction,
    GetCollectionWithAuthRequestHandlerFactoryProps,
    GetCollectionWoAuthRequestHandlerFactoryProps
} from "exprest-shared";

/**
 * Get handler factory for get at the resource level (e.g. get-all)
 * 
 * This factory is meant to be used with authenticated GET routes.
 * 
 * Example usage:
 * app.use("/api/resource", getCollectionWoAuth({
 *     contextCreateFunction: () => ({}),
 *     sanitizeParamsFunction: () => [null, {}],
 *     retrieveEntityCollectionFunction: () => [{id: 1, name: "Entity 1"}, {id: 2, name: "Entity 2"}],
 *     convertToFrontEndEntityFunction: ({entity}) => entity,
 *     otherDataValueOrFunction: {total: 2},
 *     postExecutionFunction: ({status, isSuccessful, entities, params, context, feEntities}) => {
 *         console.log("Entities:", feEntities);
 *     },
 * });
 * 
 */
export function getCollectionWoAuth<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        retrieveEntityCollectionFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: GetCollectionWoAuthRequestHandlerFactoryProps<
        ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>
): GetCollectionRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedResourceRequestHandlerHelper(
        {
            contextCreateFunction,
            sanitizeHeadersFunction,
            sanitizeParamsFunction,
            postExecutionFunction
        },
        async ({res, context, headers, params}) => {
            const entities = await retrieveEntityCollectionFunction({context, headers, params});
            const feEntitiesOrPromises =
                entities.map((entity) => convertToFrontEndEntityFunction({entity, context, headers, params}));
            const feEntities = await Promise.all(feEntitiesOrPromises);
            const otherData = (typeof otherDataValueOrFunction === "function"
                ? (await otherDataValueOrFunction({context, entities, headers, params}))
                : otherDataValueOrFunction);
            res.status(200).json(collectionResponse(feEntities, otherData));
            postExecutionFunction && postExecutionFunction({
                status: 200,
                isSuccessful: true,
                entities, headers, params, context, feEntities });
        }
    );
}

/**
 * Get handler factory for get at the resource level (e.g. get-all)
 *
 * This factory is meant to be used with authenticated GET routes.
 *
 * Example usage:
 * app.use("/api/resource", authenticatedResourceGetHandlerFactory({
 *     contextCreateFunction: () => ({}),
 *     sanitizeParamsFunction: () => [null, {}],
 *     retrieveEntityCollectionFunction: () => [{id: 1, name: "Entity 1"}, {id: 2, name: "Entity 2"}],
 *     convertToFrontEndEntityFunction: ({entity}) => entity,
 *     otherDataValueOrFunction: {total: 2},
 *     postExecutionFunction: ({status, isSuccessful, entities, params, context, feEntities}) => {
 *         console.log("Entities:", feEntities);
 *     },
 * });
 *
 */
export function getCollectionWithAuth<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        retrieveEntityCollectionFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: GetCollectionWithAuthRequestHandlerFactoryProps<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>
): GetCollectionRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedResourceRequestHandlerHelper(
        {
            contextCreateFunction,
            sanitizeHeadersFunction,
            sanitizeParamsFunction,
            postExecutionFunction
        }, async ({res, user, context, headers, params}) => {
            const entities = await retrieveEntityCollectionFunction({user, context, headers, params});
            const feEntitiesOrPromises =
                entities.map((entity) => convertToFrontEndEntityFunction({entity, user, context, headers, params}));
            const feEntities = await Promise.all(feEntitiesOrPromises);
            const otherData = (typeof otherDataValueOrFunction === "function"
                ? (await otherDataValueOrFunction({user, context, entities, headers, params}))
                : otherDataValueOrFunction);
            res.status(200).json(collectionResponse(feEntities, otherData));
            postExecutionFunction && postExecutionFunction({
                status: 200,
                isSuccessful: true,
                user, entities, headers, params, context, feEntities});
        }
    );
}
