import {
    authenticatedEntityRequestHandlerHelper,
    unauthenticatedEntityRequestHandlerHelper
} from './request-handler-helpers.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    ConvertToFrontEndEntityWithAuthWithIdFunction,
    ConvertToFrontEndEntityWoAuthWithIdFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    EntityReturningRequestHandlerFunction,
    OtherDataWithAuthWithEntityWithIdFunction,
    OtherDataWoAuthWithEntityWithIdFunction,
    PostExecutionFunctionWithIdWithEntity,
    PostExecutionFunctionWithUserWithIdWithEntity,
    RetrieveEntityFunctionWithId,
    RetrieveEntityFunctionWithUserWithId,
    SanitizeIdFunction,
    SanitizeParamsWithAuthWithIdFunction,
    SanitizeParamsWoAuthWithIdFunction
} from './types.js';

export function authenticatedEntityGetRequestHandlerFactory<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number,
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        idParamName?: string,
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeIdFunction: SanitizeIdFunction<ID>,
        sanitizeParamsFunction: SanitizeParamsWithAuthWithIdFunction<ID, USER, CONTEXT, SANITIZED_PARAMS>,
        retrieveEntityFunction: RetrieveEntityFunctionWithUserWithId<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction:
            ConvertToFrontEndEntityWithAuthWithIdFunction<
                ID, USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA
                | OtherDataWithAuthWithEntityWithIdFunction<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithIdWithEntity<
                ID, USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, user, submittedEntityId, context, params}) => {
            const entity = await retrieveEntityFunction({user, submittedEntityId, context, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, user, context, submittedEntityId, params});
                const otherData = (otherDataValueOrFunction instanceof Function
                    ? await otherDataValueOrFunction({user, entity, context, submittedEntityId, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity, submittedEntityId, params, context, feEntity});
            }
        }
    );
}

export function unauthenticatedEntityGetRequestHandlerFactory<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number,
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        retrieveEntityFunction,
        convertToFrontEndEntityFunction,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        idParamName?: string,
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeIdFunction: SanitizeIdFunction<ID>,
        sanitizeParamsFunction: SanitizeParamsWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_PARAMS>,
        retrieveEntityFunction: RetrieveEntityFunctionWithId<ID, ENTITY, SANITIZED_PARAMS, CONTEXT>,
        convertToFrontEndEntityFunction:
            ConvertToFrontEndEntityWoAuthWithIdFunction<ID, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntityWithIdFunction<ID, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?:
            PostExecutionFunctionWithIdWithEntity<ID, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, submittedEntityId, context, params}) => {
            const entity = await retrieveEntityFunction({submittedEntityId, context, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, context, submittedEntityId, params});
                const otherData = (otherDataValueOrFunction instanceof Function
                    ? await otherDataValueOrFunction({entity, context, submittedEntityId, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity, submittedEntityId, params, context, feEntity});
            }
        }
    );
}

