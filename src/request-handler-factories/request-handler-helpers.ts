import express from 'express';
import { errorResponse } from '../helpers/response-helpers.js';

export function getUserFromRequest<USER>(req: express.Request & {user?: USER}): USER | null {
    if (req.user) {
        return req.user;
    } else {
        return null;
    }
}

function authenticatedRequestHandlerHelperBase<ID, USER, SANITIZED_PARAMS, CONTEXT>(
    {
        contextCreateFunction,
        postExecutionFunction,
    } : {
        contextCreateFunction: (param0: {user: USER}) => CONTEXT | Promise<CONTEXT>,
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    },
    innerFunction: (param0: {req: express.Request, res: express.Response, user: USER, context: CONTEXT}) => Promise<void>
) {
    return async (req: express.Request, res: express.Response) => {
        const user = getUserFromRequest<USER>(req);
        if (!user) {
            res.status(401).send();
            // NOTE: We are not calling postResponseFunction here because the user is not authenticated.
            // Running code after failed authentication could be a security risk (e.g. DoS attacks).
            return;
        }

        const context = await contextCreateFunction({user});

        try {
            await innerFunction({req, res, user, context});
        } catch (err) {
            console.error("Returning 500 due to error" + (err instanceof Error ? `: ${err.stack}` : ""));
            res.status(500).send();
            postExecutionFunction && postExecutionFunction({status: 500, isSuccessful: false, user, context});
        }
    }
}

function unauthenticatedRequestHandlerHelperBase<ID, SANITIZED_PARAMS extends {[key: string]: string}, CONTEXT>(
    {
        contextCreateFunction,
        postExecutionFunction,
    } : {
        contextCreateFunction: (param0: {}) => CONTEXT | Promise<CONTEXT>,
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    },
    innerFunction: (param0: {req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response, context: CONTEXT}) => Promise<void>
) {
    return async (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response) => {
        const context = await contextCreateFunction({});

        try {
            await innerFunction({req, res, context});
        } catch (err) {
            console.error("Returning 500 due to error" + (err instanceof Error ? `: ${err.stack}` : ""));
            res.status(500).send();
            postExecutionFunction && postExecutionFunction({status: 500, isSuccessful: false, context});
        }
    }
}

export function authenticatedResourceRequestHandlerHelper<USER, SANITIZED_PARAMS, CONTEXT>(
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        contextCreateFunction: (param0: {user: USER}) => CONTEXT | Promise<CONTEXT>,
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, user: USER, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    },
    innerFunction: (param0: {req: express.Request, res: express.Response, user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<void>
) {
    return authenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        async ({req, res, user, context}) => {
            const [paramsErrors, params] = await sanitizeParamsFunction({unsanitizedParams: req.params, user, context});
            if (paramsErrors !== null) {
                res.status(400).json(errorResponse(paramsErrors));
                postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, user, context});
                return;
            }

            innerFunction({req, res, user, context, params});
        }
    );
}

export function unauthenticatedResourceRequestHandlerHelper<SANITIZED_PARAMS extends {[key: string]: string}, CONTEXT>(
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        contextCreateFunction: (param0: {}) => CONTEXT | Promise<CONTEXT>,
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    },
    innerFunction: (param0: {req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<void>
) {
    return unauthenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        async ({req, res, context}) => {
            const [paramsErrors, params] = await sanitizeParamsFunction({unsanitizedParams: req.params, context});
            if (paramsErrors !== null) {
                res.status(400).json(errorResponse(paramsErrors));
                postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context});
                return;
            }

            innerFunction({req, res, context, params});
        }
    );
}

export function authenticatedEntityRequestHandlerHelper<ID, USER, SANITIZED_PARAMS, CONTEXT>(
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        idParamName: string,
        contextCreateFunction: (param0: {user: USER}) => CONTEXT | Promise<CONTEXT>,
        sanitizeIdFunction: (param0: {idParam: string}) => [Array<string>, null] | [null, ID],
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, user: USER, submittedEntityId: ID, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    },
    innerFunction: (param0: {req: express.Request, res: express.Response, user: USER, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<void>
) {
    return authenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        async ({req, res, user, context}) => {
            const [submittedEntityIdErrors, submittedEntityId] = sanitizeIdFunction({idParam: req.params[idParamName]});
            if (submittedEntityIdErrors !== null) {
                res.status(404).json(errorResponse(submittedEntityIdErrors));
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, user, context});
                return;
            }

            // This is duplicated between this function and the collection helper, because it should be run
            // after sanitizing the id
            const [paramsErrors, params] = await sanitizeParamsFunction({unsanitizedParams: req.params, submittedEntityId, user, context});
            if (paramsErrors !== null) {
                res.status(400).json(errorResponse(paramsErrors));
                postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, user, context});
                return;
            }

            innerFunction({req, res, user, context, submittedEntityId, params});
        }
    )
}

export function unauthenticatedEntityRequestHandlerHelper<ID, SANITIZED_PARAMS extends {[key: string]: string}, CONTEXT>(
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        idParamName: string,
        contextCreateFunction: (param0: {}) => CONTEXT | Promise<CONTEXT>,
        sanitizeIdFunction: (param0: {idParam: string}) => [Array<string>, null] | [null, ID],
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, submittedEntityId: ID, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, submittedEntityId?: ID, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    },
    innerFunction: (param0: {req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response, context: CONTEXT, submittedEntityId: ID, params: SANITIZED_PARAMS}) => Promise<void>
) {
    return unauthenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        async ({req, res, context}) => {
            if (!req.params[idParamName]) {
                res.status(404).json(errorResponse([`No ${idParamName} provided`]));
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context});
                return;
            }
            const [submittedEntityIdErrors, submittedEntityId] = sanitizeIdFunction({idParam: req.params[idParamName]});
            if (submittedEntityIdErrors !== null) {
                res.status(404).json(errorResponse(submittedEntityIdErrors));
                postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context});
                return;
            } 

            // This is duplicated between this function and the collection helper, because it should be run
            // after sanitizing the id
            const [paramsErrors, params] = await sanitizeParamsFunction({unsanitizedParams: req.params, submittedEntityId, context});
            if (paramsErrors !== null) {
                res.status(400).json(errorResponse(paramsErrors));
                postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context});
                return;
            }

            innerFunction({req, res, context, submittedEntityId, params});
        }
    )
}