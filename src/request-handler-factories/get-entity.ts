import { SuccessfulEntityResponse, SuccessfulEntityResponseWithOtherData } from '@egokt/exprest-shared';
import express from 'express';
import { authenticatedEntityRequestHandlerHelper, unauthenticatedEntityRequestHandlerHelper } from './request-handler-helpers.js';
import { entityResponse } from '../helpers/response-helpers.js';

export function authenticatedEntityGetRequestHandlerFactory<
    ID, USER, ENTITY extends Object, FRONT_END_ENTITY extends Object, SANITIZED_PARAMS, CONTEXT extends Object = {}, OTHER_DATA extends Object | null = null
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
        contextCreateFunction: (param0: {user: USER}) => CONTEXT | Promise<CONTEXT>,
        sanitizeIdFunction: (param0: {idParam: string}) => [Array<string>, null] | [null, ID],
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, user: USER, submittedEntityId: ID, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        retrieveEntityFunction: (param0: {user: USER, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<ENTITY> | ENTITY,
        convertToFrontEndEntityFunction: (param0: {entity: ENTITY, user: USER, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {user: USER, context: CONTEXT, entity: ENTITY, submittedEntityId: ID, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, entity?: ENTITY, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request, res: express.Response<OTHER_DATA extends never ? SuccessfulEntityResponse<ENTITY> : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
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
    ID, ENTITY extends Object, FRONT_END_ENTITY extends Object, SANITIZED_PARAMS extends {[key: string]: string}, CONTEXT extends Object = {}, OTHER_DATA extends Object | null = null
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
        contextCreateFunction: (param0: {}) => CONTEXT | Promise<CONTEXT>,
        sanitizeIdFunction: (param0: {idParam: string}) => [Array<string>, null] | [null, ID],
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, submittedEntityId: ID, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        retrieveEntityFunction: (param0: {context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<ENTITY> | ENTITY,
        convertToFrontEndEntityFunction: (param0: {entity: ENTITY, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY,
        otherDataValueOrFunction?: OTHER_DATA | ((param0: {context: CONTEXT, entity: ENTITY, submittedEntityId: ID, params: SANITIZED_PARAMS}) => OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA)),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, entity?: ENTITY, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT, feEntity?: FRONT_END_ENTITY}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<OTHER_DATA extends never ? SuccessfulEntityResponse<ENTITY> : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>>) => Promise<void> {
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
