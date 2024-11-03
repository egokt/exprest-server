import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    ConvertToFrontEndEntityWithAuthFunction,
    ConvertToFrontEndEntityWoAuthFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    EntityReturningRequestHandlerFunction,
    OtherDataWithAuthWithEntityFunction,
    OtherDataWoAuthWithEntityFunction,
    PostExecutionFunctionWithEntity,
    PostExecutionFunctionWithUserWithEntity,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction
} from './types.js';

export function authenticatedResourceDeleteSingletonRequestHandlerFactory<
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
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS>,
        determineAuthorityToDeleteFunction?: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        deleteEntityFunction: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWithAuthFunction<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWithAuthWithEntityFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithEntity<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedResourceRequestHandlerHelper(
        { contextCreateFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, user, context, params}) => {
            const [canDeleteErrors, canDelete] =
                (determineAuthorityToDeleteFunction ? (await determineAuthorityToDeleteFunction({user, context, params})) : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, user, context, params});
            } else {
                const deletedEntity = await deleteEntityFunction({user, context, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, context, params});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({entity: deletedEntity, user, context, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (otherDataValueOrFunction instanceof Function
                                ? await otherDataValueOrFunction({user, context, entity: deletedEntity, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity: deletedEntity, params, context, feEntity});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity: deletedEntity, params, context, feEntity});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, user, context, params});
                    }
                }
            }
        }
    );
}

export function unauthenticatedResourceDeleteSingletonRequestHandlerFactory<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_PARAMS>,
        determineAuthorityToDeleteFunction?: (param0: {context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        deleteEntityFunction: (param0: {context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWoAuthFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntityFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?: PostExecutionFunctionWithEntity<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedResourceRequestHandlerHelper(
        { contextCreateFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, context, params}) => {
            const [canDeleteErrors, canDelete] =
                (determineAuthorityToDeleteFunction ? (await determineAuthorityToDeleteFunction({context, params})) : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, context, params});
            } else {
                const deletedEntity = await deleteEntityFunction({context, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context, params});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({entity: deletedEntity, context, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (otherDataValueOrFunction instanceof Function
                                ? await otherDataValueOrFunction({context, entity: deletedEntity, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity: deletedEntity, params, context, feEntity});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity: deletedEntity, params, context, feEntity});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, context, params});
                    }
                }
            }
        }
    );
}
