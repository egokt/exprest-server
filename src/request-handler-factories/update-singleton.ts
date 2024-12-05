import {
    EntityReturningRequestHandlerFunction,
    UpdateSingletonWithAuthRequestHandlerFactoryProps,
    UpdateSingletonWoAuthRequestHandlerFactoryProps
} from 'exprest-shared';
import { createWithAuth, createWoAuth } from './create.js';

/**
 *
 * Note: this function is syntactic sugar: it's the same as resource level create factory.
 * @param param0
 * @returns
 */
export function updateSingletonWithAuth<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToUpdateFunction = undefined,
        updateEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: UpdateSingletonWithAuthRequestHandlerFactoryProps<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return createWithAuth<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA
    >({
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToCreateFunction: determineAuthorityToUpdateFunction,
        createEntityFunction: updateEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction,
        postExecutionFunction,
    });
}

/**
 * 
 * Note: this function is syntactic sugar: it's the same as resource level create factory.
 * @param param0 
 * @returns 
 */
export function updateSingletonWoAuth<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToUpdateFunction = undefined,
        updateEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: UpdateSingletonWoAuthRequestHandlerFactoryProps<
        ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return createWoAuth<
        ENTITY, FRONT_END_ENTITY, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA
    >({
        contextCreateFunction, 
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToCreateFunction: determineAuthorityToUpdateFunction,
        createEntityFunction: updateEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction,
        postExecutionFunction,
    });
}

