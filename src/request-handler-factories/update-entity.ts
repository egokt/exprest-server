import {
    authenticatedEntityRequestHandlerHelper,
    unauthenticatedEntityRequestHandlerHelper
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { entityResponse } from '../helpers/entity-response.js';
import {
    EntityReturningRequestHandlerFunction,
    UpdateEntityWithAuthRequestHandlerFactoryProps,
    UpdateEntityWoAuthRequestHandlerFactoryProps
} from 'exprest-shared';

export function updateEntityWithAuth<
    USER,
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number,
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToUpdateFunction = undefined,
        updateEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: UpdateEntityWithAuthRequestHandlerFactoryProps<
        USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA, ID>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return authenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({req, res, user, submittedEntityId, context, params}) => {
            const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, user, context, submittedEntityId, params});
            if (bodyErrors !== null) {
                res.status(400).json(errorResponse(bodyErrors));
                postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, user, context, params});
                return;
            }

            const [canUpdateErrors, canUpdate] =
                (determineAuthorityToUpdateFunction ? (await determineAuthorityToUpdateFunction({user, submittedEntityId, context, params, body})) : [[], true]);
            if (!canUpdate) {
                res.status(403).json(errorResponse(canUpdateErrors));
                postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, user, context, submittedEntityId, params, body});
            } else {
                const entity =
                    await updateEntityFunction({user, submittedEntityId, params, body, context});
                if (entity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, context, submittedEntityId, params, body});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({entity, user, context, submittedEntityId, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (typeof otherDataValueOrFunction === "function"
                                ? await otherDataValueOrFunction({user, context, entity, submittedEntityId, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity, submittedEntityId, params, context, feEntity, body});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, user, entity, submittedEntityId, params, context, feEntity, body});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, entity, user, context, submittedEntityId, params, body});
                    }
                }
            }
        }
    );
}

export function updateEntityWoAuth<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY extends Object,
    CONTEXT extends Object = {},
    OTHER_DATA extends Object | null = null,
    ID = number,
> (
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        determineAuthorityToUpdateFunction = undefined,
        updateEntityFunction,
        convertToFrontEndEntityFunction = undefined,
        otherDataValueOrFunction = undefined,
        postExecutionFunction = undefined,
    }: UpdateEntityWoAuthRequestHandlerFactoryProps<
        ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, OTHER_DATA, ID>
): EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA> {
    return unauthenticatedEntityRequestHandlerHelper(
        { contextCreateFunction, idParamName, sanitizeIdFunction, sanitizeParamsFunction, postExecutionFunction },
        async ({req, res, submittedEntityId, context, params}) => {
            const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, context, submittedEntityId, params});
            if (bodyErrors !== null) {
                res.status(400).json(errorResponse(bodyErrors));
                postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context, params});
                return;
            }

            const [canUpdateErrors, canUpdate] =
                (determineAuthorityToUpdateFunction ? (await determineAuthorityToUpdateFunction({submittedEntityId, context, params, body})) : [[], true]);
            if (!canUpdate) {
                res.status(403).json(errorResponse(canUpdateErrors));
                postExecutionFunction && postExecutionFunction({status: 403, isSuccessful: false, context, submittedEntityId, params, body});
            } else { 
                const entity =
                    await updateEntityFunction({submittedEntityId, params, body, context});
                if (entity === null) {
                    res.status(404).end();
                    postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context, submittedEntityId, params, body});
                } else {
                    if (convertToFrontEndEntityFunction) {
                        const feEntity = await convertToFrontEndEntityFunction({entity, context, submittedEntityId, params});
                        if (otherDataValueOrFunction) {
                            const otherData = (typeof otherDataValueOrFunction === "function"
                                ? await otherDataValueOrFunction({context, entity, submittedEntityId, params})
                                : otherDataValueOrFunction);
                            res.status(200).json(entityResponse(feEntity, otherData));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity, submittedEntityId, params, context, feEntity, body});
                        } else {
                            res.status(200).json(entityResponse(feEntity));
                            postExecutionFunction && postExecutionFunction({status: 200, isSuccessful: true, entity, submittedEntityId, params, context, feEntity, body});
                        }
                    } else {
                        res.status(204).end();
                        postExecutionFunction && postExecutionFunction({status: 204, isSuccessful: true, context, entity, submittedEntityId, params, body});
                    }
                }
            }
        }
    );
}
