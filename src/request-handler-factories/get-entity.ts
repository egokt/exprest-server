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
    }: GetEntityWithAuthRequestHandlerFactoryProps<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA, ID>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, user, submittedEntityId, context, params}) => {
            const entity = await retrieveEntityFunction({user, submittedEntityId, context, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, params, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, user, context, submittedEntityId, params});
                const otherData = (typeof otherDataValueOrFunction === "function"
                    ? await otherDataValueOrFunction({user, entity, context, submittedEntityId, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity, submittedEntityId, params, context, feEntity});
            }
        }
    );
}

export function getEntityWoAuth<
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
    }: GetEntityWoAuthRequestHandlerFactoryProps<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA, ID>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({res, submittedEntityId, context, params}) => {
            const entity = await retrieveEntityFunction({submittedEntityId, context, params});
            if (entity === null) {
                res.status(404).send();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, params, context});
            } else {
                const feEntity = await convertToFrontEndEntityFunction({entity, context, submittedEntityId, params});
                const otherData = (typeof otherDataValueOrFunction === "function"
                    ? await otherDataValueOrFunction({entity, context, submittedEntityId, params})
                    : otherDataValueOrFunction);
                res.status(200).json(entityResponse(feEntity, otherData));
                postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity, submittedEntityId, params, context, feEntity});
            }
        }
    );
}

