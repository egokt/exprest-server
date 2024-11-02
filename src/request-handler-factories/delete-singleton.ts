import { SuccessfulEntityResponse, SuccessfulEntityResponseWithOtherData } from '@egokt/exprest-shared';
import express from 'express';
import { authenticatedResourceRequestHandlerHelper, unauthenticatedResourceRequestHandlerHelper } from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';

export function authenticatedResourceDeleteSingletonRequestHandlerFactory<
    USER, ENTITY extends Object, FRONT_END_ENTITY extends Object, SANITIZED_PARAMS extends {[key: string]: string}, CONTEXT extends Object = {}, OTHER_DATA extends Object | null = null
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
        contextCreateFunction: (param0: {user: USER}) => CONTEXT | Promise<CONTEXT>,
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, user: USER, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        determineAuthorityToDeleteFunction?: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        deleteEntityFunction: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?: (param0: {entity: ENTITY, user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {user: USER, context: CONTEXT, entity: ENTITY, params: SANITIZED_PARAMS}) => Promise<OTHER_DATA> | OTHER_DATA),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, entity?: ENTITY, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends never ? SuccessfulEntityResponse<ENTITY> : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
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
    ENTITY extends Object, FRONT_END_ENTITY extends Object, SANITIZED_PARAMS extends {[key: string]: string}, CONTEXT extends Object = {}, OTHER_DATA extends Object | null = null
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
        contextCreateFunction: (param0: {}) => CONTEXT | Promise<CONTEXT>,
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        determineAuthorityToDeleteFunction?: (param0: {context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        deleteEntityFunction: (param0: {context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?: (param0: {entity: ENTITY, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {context: CONTEXT, entity: ENTITY, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, entity?: ENTITY, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends null ? SuccessfulEntityResponse<ENTITY> : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
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
