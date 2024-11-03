import {
    authenticatedResourceRequestHandlerHelper,
    unauthenticatedResourceRequestHandlerHelper
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    ConvertToFrontEndEntityWithAuthFunction,
    ConvertToFrontEndEntityWoAuthFunction,
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    EntityReturningRequestHandlerFunction,
    OtherDataWithAuthWithEntityFunction,
    OtherDataWoAuthWithEntityFunction,
    SanitizeBodyWithAuthFunction,
    SanitizeBodyWoAuthFunction,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction
} from './types.js';

export function unauthenticatedResourceCreateSingletonRequestHandlerFactory<
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
        determineAuthorityToCreateFunction = undefined,
        createEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_PARAMS>,
        sanitizeBodyFunction: SanitizeBodyWoAuthFunction<CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY>,
        determineAuthorityToCreateFunction?: (param0: {context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        createEntityFunction: (param0: {context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWoAuthFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWoAuthWithEntityFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, entity?: ENTITY, feEntity?: FRONT_END_ENTITY, body?: SANITIZED_BODY, params?: SANITIZED_PARAMS, context: CONTEXT, feEntities?: Array<FRONT_END_ENTITY>}) => void | Promise<void>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedResourceRequestHandlerHelper({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({req, res, context, params}) => {
        const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, context, params});
        if (bodyErrors !== null) {
            res.status(400).json(errorResponse(bodyErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context, params});
            return;
        }

        const [canCreateErrors, canCreate] =
            (determineAuthorityToCreateFunction ? (await determineAuthorityToCreateFunction({context, params, body})) : [[], true]);
        if (!canCreate) {
            res.status(403).json(errorResponse(canCreateErrors));
            postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, context, params, body});
        } else { 
            const entity =
                await createEntityFunction({params, body, context});
            if (entity === null) {
                res.status(404).end();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context, params, body});
            } else {
                if (convertToFrontEndEntityFunction) {
                    const feEntity = await convertToFrontEndEntityFunction({entity, context, params});
                    if (otherDataValueOrFunction) {
                        const otherData = (otherDataValueOrFunction instanceof Function
                            ? await otherDataValueOrFunction({context, entity, params})
                            : otherDataValueOrFunction);
                        res.status(200).json(entityResponse(feEntity, otherData));
                        postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity, params, context, feEntity, body});
                    } else {
                        res.status(200).json(entityResponse(feEntity));
                        postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity, params, context, feEntity, body});
                    }
                } else {
                    res.status(204).end();
                    postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, context, params, body});
                }
            }
        }
    });
} 

export function authenticatedResourceCreateSingletonRequestHandlerFactory<
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
        determineAuthorityToCreateFunction = undefined,
        createEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS>,
        sanitizeBodyFunction: SanitizeBodyWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY>,
        determineAuthorityToCreateFunction?: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<[Array<string>, boolean]> | [Array<string>, boolean],
        createEntityFunction: (param0: {user: USER, context: CONTEXT, params: SANITIZED_PARAMS, body: SANITIZED_BODY}) => Promise<ENTITY | null> | ENTITY | null,
        convertToFrontEndEntityFunction?:
            ConvertToFrontEndEntityWithAuthFunction<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT>,
        otherDataValueOrFunction?:
            OTHER_DATA | OtherDataWithAuthWithEntityFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA>,
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, entity?: ENTITY, feEntity?: FRONT_END_ENTITY, body?: SANITIZED_BODY, params?: SANITIZED_PARAMS, context: CONTEXT, feEntities?: Array<FRONT_END_ENTITY>}) => void | Promise<void>,
    }
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedResourceRequestHandlerHelper({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({req, res, user, context, params}) => {
        const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, user, context, params});
        if (bodyErrors !== null) {
            res.status(400).json(errorResponse(bodyErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, user, context, params});
            return;
        }

        const [canCreateErrors, canCreate] =
            (determineAuthorityToCreateFunction ? (await determineAuthorityToCreateFunction({user, context, params, body})) : [[], true]);
        if (!canCreate) {
            res.status(403).json(errorResponse(canCreateErrors));
            postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, user, context, params, body});
        } else {
            const entity =
                await createEntityFunction({user, params, body, context});
            if (entity === null) {
                res.status(404).end();
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, context, params, body});
            } else {
                if (convertToFrontEndEntityFunction) {
                    const feEntity = await convertToFrontEndEntityFunction({entity, user, context, params});
                    if (otherDataValueOrFunction) {
                        const otherData = (otherDataValueOrFunction instanceof Function
                            ? await otherDataValueOrFunction({user, context, entity, params})
                            : otherDataValueOrFunction);
                        res.status(200).json(entityResponse(feEntity, otherData));
                        postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity, params, context, feEntity, body});
                    } else {
                        res.status(200).json(entityResponse(feEntity));
                        postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity, params, context, feEntity, body});
                    }
                } else {
                    res.status(204).end();
                    postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, user, context, params, body});
                }
            }
        }
    });
}
