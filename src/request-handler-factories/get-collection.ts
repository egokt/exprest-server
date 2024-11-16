import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from "./request-handler-helpers.js";
import { collectionResponse } from "../helpers/collection-response.js";
import {
    ConvertToFrontEndEntityWithAuthFunction,
    ConvertToFrontEndEntityWoAuthFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    GetCollectionRequestHandlerFunction,
    OtherDataWithAuthWithEntitiesFunction,
    OtherDataWoAuthWithEntitiesFunction,
    PostExecutionFunctionWithEntities,
    PostExecutionFunctionWithUserWithEntities,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction
} from "./types.js";

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
        postExecutionFunction?: PostExecutionFunctionWithEntities<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): GetCollectionRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedResourceRequestHandlerHelper({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({res, context, params}) => {
        const entities = await retrieveEntityCollectionFunction({context, params});
        const feEntitiesOrPromises =
            entities.map((entity) => convertToFrontEndEntityFunction({entity, context, params}));
        const feEntities = await Promise.all(feEntitiesOrPromises);
        const otherData = (typeof otherDataValueOrFunction === "function"
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
export function getCollectionWithAuth<
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
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithEntities<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): GetCollectionRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedResourceRequestHandlerHelper({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({res, user, context, params}) => {
        const entities = await retrieveEntityCollectionFunction({user, context, params});
        const feEntitiesOrPromises =
            entities.map((entity) => convertToFrontEndEntityFunction({entity, user, context, params}));
        const feEntities = await Promise.all(feEntitiesOrPromises);
        const otherData = (typeof otherDataValueOrFunction === "function"
            ? (await otherDataValueOrFunction({user, context, entities, params}))
            : otherDataValueOrFunction);
        res.status(200).json(collectionResponse(feEntities, otherData));
        postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entities, params, context, feEntities});
    });
}
