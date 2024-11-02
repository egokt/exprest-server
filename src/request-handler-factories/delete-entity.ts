import { SuccessfulEntityResponse, SuccessfulEntityResponseWithOtherData } from '@egokt/exprest-shared';
import express from 'express';
import { authenticatedEntityRequestHandlerHelper, unauthenticatedEntityRequestHandlerHelper } from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';
import { CreateContextWithAuthFunction, CreateContextWoAuthFunction, SanitizeIdFunction, SanitizeParamsWithAuthWithIdFunction, SanitizeParamsWoAuthWithIdFunction } from './types.js';

export function authenticatedEntityDeleteRequestHandlerFactory<
    ID,
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
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
        determineAuthorityToDeleteFunction?: (param0: {user: USER, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        deleteEntityFunction: (param0: {user: USER, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?: (param0: {entity: ENTITY, user: USER, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {user: USER, context: CONTEXT, entity: ENTITY, submittedEntityId: ID, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, entity?: ENTITY, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends never ? SuccessfulEntityResponse<ENTITY> : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
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
    ID,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
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
        determineAuthorityToDeleteFunction?: (param0: {context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        deleteEntityFunction: (param0: {context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?: (param0: {entity: ENTITY, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {context: CONTEXT, entity: ENTITY, submittedEntityId: ID, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, entity?: ENTITY, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request<Record<keyof SANITIZED_PARAMS, string | undefined>>, res: express.Response<OTHER_DATA extends never ? SuccessfulEntityResponse<ENTITY> : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
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

