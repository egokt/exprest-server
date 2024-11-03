import {
    authenticatedEntityRequestHandlerHelper,
    unauthenticatedEntityRequestHandlerHelper
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    ConvertToFrontEndEntityWithAuthWithIdFunction,
    ConvertToFrontEndEntityWoAuthWithIdFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    DeleteFunctionWithId,
    DeleteFunctionWithUserWithId,
    DetermineAuthorityToChangeFunctionWithId,
    DetermineAuthorityToChangeFunctionWithUserWithId,
    EntityReturningRequestHandlerFunction,
    OtherDataWithAuthWithEntityWithIdFunction,
    OtherDataWoAuthWithEntityWithIdFunction,
    PostExecutionFunctionWithIdWithEntity,
    PostExecutionFunctionWithUserWithIdWithEntity,
    SanitizeIdFunction,
    SanitizeParamsWithAuthWithIdFunction,
    SanitizeParamsWoAuthWithIdFunction
} from './types.js';

export function authenticatedEntityDeleteRequestHandlerFactory<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        idParamName?: string,
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeIdFunction: SanitizeIdFunction<ID>,
        sanitizeParamsFunction: SanitizeParamsWithAuthWithIdFunction<ID, USER, CONTEXT, SANITIZED_PARAMS>,
        determineAuthorityToDeleteFunction?:
            DetermineAuthorityToChangeFunctionWithUserWithId<ID, USER, SANITIZED_PARAMS, CONTEXT>,
        deleteEntityFunction: DeleteFunctionWithUserWithId<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWithAuthWithIdFunction<
                ID, USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA
                | OtherDataWithAuthWithEntityWithIdFunction<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithIdWithEntity<ID, USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, user, submittedEntityId, context, params}) => {
            const [canDeleteErrors, canDelete] =
                (determineAuthorityToDeleteFunction ? (await determineAuthorityToDeleteFunction({user, submittedEntityId, context, params})) : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, user, context, submittedEntityId, params});
            } else {
                const deletedEntity = await deleteEntityFunction({user, submittedEntityId, context, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, context, submittedEntityId, params});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({entity: deletedEntity, user, context, submittedEntityId, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (otherDataValueOrFunction instanceof Function
                                ? await otherDataValueOrFunction({user, context, entity: deletedEntity, submittedEntityId, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity: deletedEntity, submittedEntityId, params, context, feEntity});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity: deletedEntity, submittedEntityId, params, context, feEntity});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, user, context, submittedEntityId, params});
                    }
                }
            }
        }
    );
}

export function unauthenticatedEntityDeleteRequestHandlerFactory<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        idParamName?: string,
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeIdFunction: SanitizeIdFunction<ID>,
        sanitizeParamsFunction: SanitizeParamsWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_PARAMS>,
        determineAuthorityToDeleteFunction?: DetermineAuthorityToChangeFunctionWithId<ID, SANITIZED_PARAMS, CONTEXT>,
        deleteEntityFunction: DeleteFunctionWithId<ID, ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWoAuthWithIdFunction<ID, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntityWithIdFunction<ID, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithIdWithEntity<ID, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, submittedEntityId, context, params}) => {
            const [canDeleteErrors, canDelete] =
                (determineAuthorityToDeleteFunction ? (await determineAuthorityToDeleteFunction({submittedEntityId, context, params})) : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, context, submittedEntityId, params});
            } else {
                const deletedEntity = await deleteEntityFunction({submittedEntityId, context, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context, submittedEntityId, params});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({entity: deletedEntity, context, submittedEntityId, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (otherDataValueOrFunction instanceof Function
                                ? await otherDataValueOrFunction({context, entity: deletedEntity, submittedEntityId, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity: deletedEntity, submittedEntityId, params, context, feEntity});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity: deletedEntity, submittedEntityId, params, context, feEntity});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, context, submittedEntityId, params});
                    }
                }
            }
        }
    );
}

