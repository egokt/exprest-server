import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from './request-handler-helpers.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    GetSingletonWoAuthRequestHandlerFactoryProps,
    GetSingletonWithAuthRequestHandlerFactoryProps,
    EntityReturningRequestHandlerFunction,
} from 'exprest-shared';

export function getSingletonWithAuth<
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
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: GetSingletonWithAuthRequestHandlerFactoryProps<
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
            const entity = await retrieveEntityFunction({user, context, headers, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({
                    status: 404,
                    isSuccessful: false,
                    headers, params, user, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, user, context, headers, params});
                const otherData = (typeof otherDataValueOrFunction === "function"
                    ? await otherDataValueOrFunction({user, entity, context, headers, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({
                    status: 200,
                    isSuccessful: true,
                    user, entity, headers, params, context, feEntity});
            }
        }
    );
}

export function getSingletonWoAuth<
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
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: GetSingletonWoAuthRequestHandlerFactoryProps<
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
            const entity = await retrieveEntityFunction({context, headers, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({
                    status: 404,
                    isSuccessful: false,
                    headers, params, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, context, headers, params});
                const otherData = (typeof otherDataValueOrFunction === "function"
                    ? await otherDataValueOrFunction({entity, context, headers, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({
                    status: 200,
                    isSuccessful: true,
                    entity, headers, params, context, feEntity});
            }
        }
    );
}
