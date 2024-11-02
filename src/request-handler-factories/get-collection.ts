import express from "express";
import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from "./request-handler-helpers.js";
import { SuccessfulCollectionResponse, SuccessfulCollectionResponseWithOtherData } from "@egokt/exprest-shared";
import { collectionResponse } from "../helpers/collection-response.js";
import {
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction
} from "./types.js";

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
export function unauthenticatedResourceGetCollectionRequestHandler<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        retrieveEntityCollectionFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_PARAMS>,
        retrieveEntityCollectionFunction: (param0: {context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<Array<ENTITY>> | Array<ENTITY>,
        convertToFrontEndEntityFunction: (param0: {entity: ENTITY, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {context: CONTEXT, entities: Array<ENTITY>, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, entities?: Array<ENTITY>, params?: SANITIZED_PARAMS, context: CONTEXT, feEntities?: Array<FRONT_END_ENTITY>}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends never ? SuccessfulCollectionResponse<ENTITY> : SuccessfulCollectionResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
    return unauthenticatedResourceRequestHandlerHelper({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({res, context, params}) => {
        const entities = await retrieveEntityCollectionFunction({context, params});
        const feEntitiesOrPromises =
            entities.map((entity) => convertToFrontEndEntityFunction({entity, context, params}));
        const feEntities = await Promise.all(feEntitiesOrPromises);
        const otherData = (otherDataValueOrFunction instanceof Function
            ? (await otherDataValueOrFunction({context, entities, params}))
            : otherDataValueOrFunction);
        res.status(200).json(collectionResponse(feEntities, otherData));
        postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entities, params, context, feEntities});
    });
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
export function authenticatedResourceGetCollectionRequestHandler<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        retrieveEntityCollectionFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS>,
        retrieveEntityCollectionFunction: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<Array<ENTITY>> | Array<ENTITY>,
        convertToFrontEndEntityFunction: (param0: {entity: ENTITY, user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {user: USER, context: CONTEXT, entities: Array<ENTITY>, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, entities?: Array<ENTITY>, params?: SANITIZED_PARAMS, context: CONTEXT, feEntities?: Array<FRONT_END_ENTITY>}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends never ? SuccessfulCollectionResponse<ENTITY> : SuccessfulCollectionResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
    return authenticatedResourceRequestHandlerHelper({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({res, user, context, params}) => {
        const entities = await retrieveEntityCollectionFunction({user, context, params});
        const feEntitiesOrPromises =
            entities.map((entity) => convertToFrontEndEntityFunction({entity, user, context, params}));
        const feEntities = await Promise.all(feEntitiesOrPromises);
        const otherData = (otherDataValueOrFunction instanceof Function
            ? (await otherDataValueOrFunction({user, context, entities, params}))
            : otherDataValueOrFunction);
        res.status(200).json(collectionResponse(feEntities, otherData));
        postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entities, params, context, feEntities});
    });
}
