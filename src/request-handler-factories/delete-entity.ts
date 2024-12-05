import {
    authenticatedEntityRequestHandlerHelper,
    unauthenticatedEntityRequestHandlerHelper
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    DeleteEntityWithAuthRequestHandlerFactoryProps,
    DeleteEntityWoAuthRequestHandlerFactoryProps,
    EntityReturningRequestHandlerFunction
} from 'exprest-shared';

export function deleteEntityWithAuth<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: DeleteEntityWithAuthRequestHandlerFactoryProps<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT, OTHER_DATA, ID>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedEntityRequestHandlerHelper(
        {
            contextCreateFunction,
            idParamName,
            sanitizeIdFunction,
            sanitizeHeadersFunction,
            sanitizeParamsFunction,
            postExecutionFunction
        },
        async ({res, user, submittedEntityId, context, headers, params}) => {
            const [canDeleteErrors, canDelete] =
                (determineAuthorityToDeleteFunction
                    ? (await determineAuthorityToDeleteFunction({user, submittedEntityId, context, headers, params}))
                    : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({
                    status: 403,
                    isSuccessful: false,
                    user, context, submittedEntityId, headers, params });
            } else {
                const deletedEntity = await deleteEntityFunction({user, submittedEntityId, context, headers, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({
                        status: 404,
                        isSuccessful: false,
                        user, context, submittedEntityId, params });
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({
                            entity: deletedEntity,
                            user, context, submittedEntityId, headers, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (typeof otherDataValueOrFunction === "function"
                                ? await otherDataValueOrFunction({
                                    entity: deletedEntity, 
                                    user, context, submittedEntityId, headers, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity, 
                                user, submittedEntityId, headers, params, context, feEntity});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity,
                                user, submittedEntityId, headers, params, context, feEntity});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({
                            status: 204,
                            isSuccessful: true,
                            entity: deletedEntity,
                            user, context, submittedEntityId, headers, params});
                    }
                }
            }
        }
    );
}

export function deleteEntityWoAuth<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: DeleteEntityWoAuthRequestHandlerFactoryProps<
        ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT, OTHER_DATA, ID>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedEntityRequestHandlerHelper(
        {
            contextCreateFunction,
            idParamName,
            sanitizeIdFunction,
            sanitizeHeadersFunction,
            sanitizeParamsFunction,
            postExecutionFunction
        },
        async ({res, submittedEntityId, context, headers, params}) => {
            const [canDeleteErrors, canDelete] =
                (determineAuthorityToDeleteFunction
                    ? (await determineAuthorityToDeleteFunction({submittedEntityId, context, headers, params}))
                    : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({
                    status: 403,
                    isSuccessful: false,
                    context, submittedEntityId, headers, params});
            } else {
                const deletedEntity = await deleteEntityFunction({submittedEntityId, context, headers, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({
                        status: 404,
                        isSuccessful: false,
                        context, submittedEntityId, headers, params});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({
                            entity: deletedEntity,
                            context, submittedEntityId, headers, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (typeof otherDataValueOrFunction === "function"
                                ? await otherDataValueOrFunction({
                                    entity: deletedEntity,
                                    context, submittedEntityId, headers, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity,
                                submittedEntityId, headers, params, context, feEntity});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity,
                                submittedEntityId, headers, params, context, feEntity});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({
                            status: 204,
                            isSuccessful: true,
                            entity: deletedEntity,
                            context, submittedEntityId, headers, params});
                    }
                }
            }
        }
    );
}

