import {
    authenticatedResourceCreateSingletonRequestHandlerFactory,
    unauthenticatedResourceCreateSingletonRequestHandlerFactory
} from './create.js';
import {
    ConvertToFrontEndEntityWithAuthFunction,
    ConvertToFrontEndEntityWoAuthFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    EntityReturningRequestHandlerFunction,
    OtherDataWithAuthWithEntityFunction,
    OtherDataWoAuthWithEntityFunction,
    PostExecutionFunctionWithBodyWithEntity,
    PostExecutionFunctionWithUserWithBodyWithEntity,
    SanitizeBodyWithAuthFunction,
    SanitizeBodyWoAuthFunction,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction
} from './types.js';

/**
 *
 * Note: this function is syntactic sugar: it's the same as resource level create factory.
 * @param param0
 * @returns
 */
export function authenticatedResourceUpdateSingletonRequestHandlerFactory<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToUpdateFunction = undefined,
        updateEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS>,
        sanitizeBodyFunction: SanitizeBodyWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY>,
        determineAuthorityToUpdateFunction?: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        updateEntityFunction: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWithAuthFunction<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWithAuthWithEntityFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithBodyWithEntity<
                USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedResourceCreateSingletonRequestHandlerFactory<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA
    >({
        contextCreateFunction,
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
export function unauthenticatedResourceUpdateSingletonRequestHandlerFactory<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToUpdateFunction = undefined,
        updateEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_PARAMS>,
        sanitizeBodyFunction: SanitizeBodyWoAuthFunction<CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY>,
        determineAuthorityToUpdateFunction?: (param0: {context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        updateEntityFunction: (param0: {context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWoAuthFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntityFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithBodyWithEntity<
                ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedResourceCreateSingletonRequestHandlerFactory<
        ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA
    >({
        contextCreateFunction, 
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToCreateFunction: determineAuthorityToUpdateFunction,
        createEntityFunction: updateEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction,
        postExecutionFunction,
    });
}

