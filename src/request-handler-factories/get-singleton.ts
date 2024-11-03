import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from './request-handler-helpers.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    ConvertToFrontEndEntityWithAuthFunction,
    ConvertToFrontEndEntityWoAuthFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    EntityReturningRequestHandlerFunction,
    OtherDataWithAuthWithEntityFunction,
    OtherDataWoAuthWithEntityFunction,
    PostExecutionFunctionWithEntity,
    PostExecutionFunctionWithUserWithEntity,
    RetrieveEntityFunction,
    RetriveEntityFunctionWithUser,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction
} from './types.js';

export function authenticatedResourceGetSingletonRequestHandler<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS>,
        retrieveEntityFunction: RetriveEntityFunctionWithUser<USER, ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction:
            ConvertToFrontEndEntityWithAuthFunction<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWithAuthWithEntityFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithEntity<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedResourceRequestHandlerHelper(
        { contextCreateFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, user, context, params}) => {
            const entity = await retrieveEntityFunction({user, context, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, user, context, params});
                const otherData = (otherDataValueOrFunction instanceof Function
                    ? await otherDataValueOrFunction({user, entity, context, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity, params, context, feEntity});
            }
        }
    );
}

export function unauthenticatedResourceGetSingletonRequestHandler<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_PARAMS>,
        retrieveEntityFunction: RetrieveEntityFunction<ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction:
            ConvertToFrontEndEntityWoAuthFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntityFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?: PostExecutionFunctionWithEntity<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedResourceRequestHandlerHelper(
        { contextCreateFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, context, params}) => {
            const entity = await retrieveEntityFunction({context, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, context, params});
                const otherData = (otherDataValueOrFunction instanceof Function
                    ? await otherDataValueOrFunction({entity, context, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity, params, context, feEntity});
            }
        }
    );
}
