import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    DeleteSingletonWithAuthRequestHandlerFactoryProps,
    DeleteSingletonWoAuthRequestHandlerFactoryProps,
    EntityReturningRequestHandlerFunction
} from 'exprest-shared';

export function deleteSingletonWithAuth<
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
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: DeleteSingletonWithAuthRequestHandlerFactoryProps<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedResourceRequestHandlerHelper(
        {
            contextCreateFunction,
            sanitizeHeadersFunction,
            sanitizeParamsFunction,
            postExecutionFunction
        },
        async ({res, user, context, headers, params}) => {
            const [canDeleteErrors, canDelete] =
                (determineAuthorityToDeleteFunction
                    ? (await determineAuthorityToDeleteFunction({user, context, headers, params}))
                    : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({
                    status: 403,
                    isSuccessful: false,
                    user, context, headers, params });
            } else {
                const deletedEntity = await deleteEntityFunction({user, context, headers, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({
                        status: 404,
                        isSuccessful: false,
                        user, context, headers, params});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({
                            entity: deletedEntity,
                            user, context, headers, params });
                        if (otherDataValueOrFunction) {
                            const otherData = (typeof otherDataValueOrFunction === "function"
                                ? await otherDataValueOrFunction({
                                    entity: deletedEntity,
                                    user, context, headers, params })
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity,
                                user, headers, params, context, feEntity });
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity,
                                user, headers, params, context, feEntity });
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({
                            status: 204,
                            isSuccessful: true,
                            user, context, headers, params });
                    }
                }
            }
        }
    );
}

export function deleteSingletonWoAuth<
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
        determineAuthorityToDeleteFunction = undefined,
        deleteEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: DeleteSingletonWoAuthRequestHandlerFactoryProps<
        ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedResourceRequestHandlerHelper(
        {
            contextCreateFunction,
            sanitizeHeadersFunction,
            sanitizeParamsFunction,
            postExecutionFunction
        },
        async ({res, context, headers, params}) => {
            const [canDeleteErrors, canDelete] = (determineAuthorityToDeleteFunction
                ? (await determineAuthorityToDeleteFunction({context, headers, params}))
                : [[], true]);
            if (!canDelete) {
                res.status(403).json(errorResponse(canDeleteErrors));
                postExecutionFunction && postExecutionFunction({
                    status: 403,
                    isSuccessful: false,
                    context, headers, params });
            } else {
                const deletedEntity = await deleteEntityFunction({context, headers, params});
                if (deletedEntity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({
                        status: 404,
                        isSuccessful: false,
                        context, headers, params });
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({
                            entity: deletedEntity,
                            context, headers, params });
                        if (otherDataValueOrFunction) {
                            const otherData = (typeof otherDataValueOrFunction === "function"
                                ? await otherDataValueOrFunction({entity: deletedEntity, context, headers, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity,
                                headers, params, context, feEntity });
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({
                                status: 200,
                                isSuccessful: true,
                                entity: deletedEntity,
                                headers, params, context, feEntity });
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({
                            status: 204,
                            isSuccessful: true,
                            context, headers, params });
                    }
                }
            }
        }
    );
}
