import {
    createWithAuth,
    createWoAuth
} from './create.js';
import {
    ConvertToFrontEndEntityWithAuthFunction,
    ConvertToFrontEndEntityWoAuthFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    CreateOrUpdateFunction,
    CreateOrUpdateFunctionWithUser,
    DetermineAuthorityToChangeFunctionWithBody,
    DetermineAuthorityToChangeFunctionWithUserWithBody,
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
export function updateSingletonWithAuth<
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
        determineAuthorityToUpdateFunction?:
            DetermineAuthorityToChangeFunctionWithUserWithBody<USER, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
        updateEntityFunction: CreateOrUpdateFunctionWithUser<USER, ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWithAuthFunction<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWithAuthWithEntityFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithBodyWithEntity<
                USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return createWithAuth<
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
export function updateSingletonWoAuth<
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
        determineAuthorityToUpdateFunction?:
            DetermineAuthorityToChangeFunctionWithBody<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
        updateEntityFunction: CreateOrUpdateFunction<ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWoAuthFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntityFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithBodyWithEntity<
                ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return createWoAuth<
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

