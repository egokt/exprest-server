import {
    authenticatedEntityRequestHandlerHelper,
    unauthenticatedEntityRequestHandlerHelper
} from './request-handler-helpers.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    EntityReturningRequestHandlerFunction,
    GetEntityWithAuthRequestHandlerFactoryProps,
    GetEntityWoAuthRequestHandlerFactoryProps
} from 'exprest-shared';

export function getEntityWithAuth<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number,
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: GetEntityWithAuthRequestHandlerFactoryProps<
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
            const entity = await retrieveEntityFunction({user, submittedEntityId, context, headers, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({
                    status: 404, isSuccessful: false, user, headers, params, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({
                    entity, user, context, submittedEntityId, headers, params});
                const otherData = (typeof otherDataValueOrFunction === "function"
                    ? await otherDataValueOrFunction({user, entity, context, submittedEntityId, headers, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({
                    status: 200,
                    isSuccessful: true,
                    user, entity, submittedEntityId, headers, params, context, feEntity
                });
            }
        }
    );
}

export function getEntityWoAuth<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number,
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: GetEntityWoAuthRequestHandlerFactoryProps<
        ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT, OTHER_DATA, ID>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedEntityRequestHandlerHelper(
        {
            contextCreateFunction,
            idParamName,
            sanitizeHeadersFunction,
            sanitizeIdFunction,
            sanitizeParamsFunction,
            postExecutionFunction
        },
        async ({res, submittedEntityId, context, headers, params}) => {
            const entity = await retrieveEntityFunction({submittedEntityId, context, headers, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({
                    status: 404, isSuccessful: false, headers, params, context });
            } else {
                const feEntity = await convertToFrontEndEntityFunction({
                    entity, context, submittedEntityId, headers, params });
                const otherData = (typeof otherDataValueOrFunction === "function"
                    ? await otherDataValueOrFunction({entity, context, submittedEntityId, headers, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({
                    status: 200, isSuccessful: true, entity, submittedEntityId, headers, params, context, feEntity});
            }
        }
    );
}

