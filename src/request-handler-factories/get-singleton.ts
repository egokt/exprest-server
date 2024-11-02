import { SuccessfulEntityResponse, SuccessfulEntityResponseWithOtherData } from '@egokt/exprest-shared';
import express from 'express';
import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from './request-handler-helpers.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
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
        retrieveEntityFunction: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<ENTITY> | ENTITY,
        convertToFrontEndEntityFunction: (param0: {entity: ENTITY, user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {user: USER, context: CONTEXT, entity: ENTITY, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, entity?: ENTITY, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends never ? SuccessfulEntityResponse<FRONT_END_ENTITY> : SuccessfulEntityResponseWithOtherData<FRONT_END_ENTITY, OTHER_DATA>>) => Promise<void> {
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
        retrieveEntityFunction: (param0: {context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<ENTITY> | ENTITY,
        convertToFrontEndEntityFunction: (param0: {entity: ENTITY, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {context: CONTEXT, entity: ENTITY, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, entity?: ENTITY, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends never ? SuccessfulEntityResponse<ENTITY> : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
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
