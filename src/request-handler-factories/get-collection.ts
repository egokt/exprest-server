import express from "express";
import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from "./request-handler-helpers.js";
import { SuccessfulCollectionResponse, SuccessfulCollectionResponseWithOtherData } from "@egokt/exprest-shared";
import { collectionResponse } from "../helpers/collection-response.js";
import {
    ConvertToFrontEndEntityWithAuthFunction,
    ConvertToFrontEndEntityWoAuthFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    OtherDataWithAuthWithEntitiesFunction,
    OtherDataWoAuthWithEntitiesFunction,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction
} from "./types.js";

type ExpressResponseType<ENTITY, FRONT_END_ENTITY, OTHER_DATA> =
    express.Response<
        OTHER_DATA extends never
            ? SuccessfulCollectionResponse<FRONT_END_ENTITY>
            : SuccessfulCollectionResponseWithOtherData<ENTITY, OTHER_DATA>
    >;
type GetCollectionRequestHandlerFunction<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null
> =
    (
        req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>,
        res: ExpressResponseType<ENTITY, FRONT_END_ENTITY, OTHER_DATA>
    ) => Promise<void>;

type RetrieveCollectionWoAuthFunctionProps<SANITIZED_PARAMS, CONTEXT> = {
    context: CONTEXT,
    params: SANITIZED_PARAMS,
};
type RetrieveCollectionWoAuthFunction<ENTITY, SANITIZED_PARAMS, CONTEXT> =
    (param0: RetrieveCollectionWoAuthFunctionProps<SANITIZED_PARAMS, CONTEXT>)
        => Promise<Array<ENTITY>> | Array<ENTITY>;

type RetrieveCollectionWithAuthFunctionProps<USER, SANITIZED_PARAMS, CONTEXT> =
    RetrieveCollectionWoAuthFunctionProps<SANITIZED_PARAMS, CONTEXT> & {user: USER};
type RetrieveCollectionWithAuthFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    (param0: RetrieveCollectionWithAuthFunctionProps<USER, SANITIZED_PARAMS, CONTEXT>)
        => Promise<Array<ENTITY>> | Array<ENTITY>;

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
        retrieveEntityCollectionFunction: RetrieveCollectionWoAuthFunction<ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction:
            ConvertToFrontEndEntityWoAuthFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntitiesFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, entities?: Array<ENTITY>, params?: SANITIZED_PARAMS, context: CONTEXT, feEntities?: Array<FRONT_END_ENTITY>}) => void | Promise<void>,
    }
): GetCollectionRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
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
        retrieveEntityCollectionFunction: RetrieveCollectionWithAuthFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction:
            ConvertToFrontEndEntityWithAuthFunction<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWithAuthWithEntitiesFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, entities?: Array<ENTITY>, params?: SANITIZED_PARAMS, context: CONTEXT, feEntities?: Array<FRONT_END_ENTITY>}) => void | Promise<void>,
    }
): GetCollectionRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
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
