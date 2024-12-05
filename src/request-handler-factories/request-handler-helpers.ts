import express from 'express';
import { errorResponse } from '../helpers/error-response.js';
import {
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    PostExecutionFunction,
    PostExecutionFunctionWithId,
    PostExecutionFunctionWithUser,
    PostExecutionFunctionWithUserWithId,
    SanitizeHeadersWithAuthFunction,
    SanitizeHeadersWithAuthWithIdFunction,
    SanitizeHeadersWoAuthFunction,
    SanitizeHeadersWoAuthWithIdFunction,
    SanitizeIdFunction,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWithAuthWithIdFunction,
    SanitizeParamsWoAuthFunction,
    SanitizeParamsWoAuthWithIdFunction,
} from 'exprest-shared';

export function getUserFromRequest<USER>(req: express.Request<any> & {user?: USER}): USER | null {
    if (req.user) {
        return req.user;
    } else {
        return null;
    }
}

type RequestHandlerHelperBaseWithAuthProps<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> = {
    contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
    postExecutionFunction?: PostExecutionFunctionWithUser<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
};
type RequestHandlerHelperBaseWoAuthProps<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> = {
    contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
    postExecutionFunction?: PostExecutionFunction<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
};

type RequestHandlerBaseInnerFunctionWoAuthProps<SANITIZED_PARAMS, CONTEXT> = {
    req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>,
    res: express.Response,
    context: CONTEXT,
};
type RequestHandlerBaseInnerFunctionWoAuth<SANITIZED_PARAMS, CONTEXT> =
    (param0: RequestHandlerBaseInnerFunctionWoAuthProps<SANITIZED_PARAMS, CONTEXT>) => Promise<void>;

type RequestHandlerInnerFunctionWoAuthProps<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> = 
    RequestHandlerBaseInnerFunctionWoAuthProps<SANITIZED_PARAMS, CONTEXT>
    & { headers: SANITIZED_HEADERS, params: SANITIZED_PARAMS, };
export type RequestHandlerInnerFunctionWoAuth<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> =
    (param0: RequestHandlerInnerFunctionWoAuthProps<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>) => Promise<void>;

type EntityRequestHandlerInnerFunctionWoAuthProps<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> =
    RequestHandlerInnerFunctionWoAuthProps<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> & { submittedEntityId: ID, };
type EntityRequestHandlerInnerFunctionWoAuth<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> =
    (param0: EntityRequestHandlerInnerFunctionWoAuthProps<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>)
        => Promise<void>;

type RequestHandlerBaseInnerFunctionWithAuthProps<USER, SANITIZED_PARAMS, CONTEXT> =
    RequestHandlerBaseInnerFunctionWoAuthProps<SANITIZED_PARAMS, CONTEXT> & { user: USER, };
type RequestHandlerBaseInnerFunctionWithAuth<USER, SANITIZED_PARAMS, CONTEXT> =
    (param0: RequestHandlerBaseInnerFunctionWithAuthProps<USER, SANITIZED_PARAMS, CONTEXT>) => Promise<void>;

type RequestHandlerInnerFunctionWithAuthProps<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> = 
    RequestHandlerInnerFunctionWoAuthProps<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> & { user: USER, };
type RequestHandlerInnerFunctionWithAuth<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> =
    (param0: RequestHandlerInnerFunctionWithAuthProps<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>)
        => Promise<void>;

type EntityRequestHandlerInnerFunctionWithAuthProps<ID, USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> =
    EntityRequestHandlerInnerFunctionWoAuthProps<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> & { user: USER, };
type EntityRequestHandlerInnerFunctionWithAuth<ID, USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> =
    (param0: EntityRequestHandlerInnerFunctionWithAuthProps<ID, USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>)
        => Promise<void>;

type RequestHandlerFunctionWithAuthReturnType<SANITIZED_PARAMS> =
    (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response) => Promise<void>;
type RequestHandlerFunctionWoAuthReturnType<SANITIZED_PARAMS> =
    (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response) => Promise<void>;

function authenticatedRequestHandlerHelperBase<
    USER,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>(
    {
        contextCreateFunction,
        postExecutionFunction,
    } : RequestHandlerHelperBaseWithAuthProps<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    innerFunction: RequestHandlerBaseInnerFunctionWithAuth<USER, SANITIZED_PARAMS, CONTEXT>,
): RequestHandlerFunctionWithAuthReturnType<SANITIZED_PARAMS> {
    return async (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response) => {
        const user = getUserFromRequest<USER>(req);
        if (!user) {
            res.status(401).send();
            // NOTE: We are not calling postResponseFunction here because the user is not authenticated.
            // Running code after failed authentication could be a security risk (e.g. DoS attacks).
            return;
        }

        // wrap the unathenticated helper
        await unauthenticatedRequestHandlerHelperBase<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>(
            {
                contextCreateFunction: async (param0) => await contextCreateFunction({user, ...param0}),
                ...(postExecutionFunction
                    ? { postExecutionFunction: (param0) => postExecutionFunction({user, ...param0}) }
                    : {}),
            },
            async ({req, res, context}) => await innerFunction({req, res, user, context})
        )(req, res);
    }
}

function unauthenticatedRequestHandlerHelperBase<
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>(
    {
        contextCreateFunction,
        postExecutionFunction,
    } : RequestHandlerHelperBaseWoAuthProps<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    innerFunction: RequestHandlerBaseInnerFunctionWoAuth<SANITIZED_PARAMS, CONTEXT>,
): RequestHandlerFunctionWoAuthReturnType<SANITIZED_PARAMS> {
    return async (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response) => {
        const context = await contextCreateFunction({});

        try {
            await innerFunction({req, res, context});
        } catch (err) {
            console.error("Returning 500 due to error" + (err instanceof Error ? `: ${err.stack}` : ""));
            res.status(500).end();
            postExecutionFunction && postExecutionFunction({status: 500, isSuccessful: false, context});
        }
    }
}



export function authenticatedResourceRequestHandlerHelper<
    USER,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>(
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeHeadersFunction: SanitizeHeadersWithAuthFunction<USER, CONTEXT, SANITIZED_HEADERS>,
        sanitizeParamsFunction: SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_HEADERS, SANITIZED_PARAMS>,
        postExecutionFunction?: PostExecutionFunctionWithUser<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    },
    innerFunction: RequestHandlerInnerFunctionWithAuth<USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
) {
    return authenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        async ({req, res, user, context}) =>
            requestHandlerHelperInnerFunctionBuilder<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>(
                {
                    sanitizeHeadersFunction: async (param0) => await sanitizeHeadersFunction({user, ...param0}),
                    sanitizeParamsFunction: async (param0) => await sanitizeParamsFunction({user, ...param0}),
                    ...(postExecutionFunction
                        ? { postExecutionFunction: (param0) => postExecutionFunction({user, ...param0}) }
                        : {}
                    )
                },
                (param0) => innerFunction({user, ...param0})
            )({req, res, context})
    );
}

export function unauthenticatedResourceRequestHandlerHelper<
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>(
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeHeadersFunction: SanitizeHeadersWoAuthFunction<CONTEXT, SANITIZED_HEADERS>,
        sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_HEADERS, SANITIZED_PARAMS>,
        postExecutionFunction?: PostExecutionFunction<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    },
    innerFunction: RequestHandlerInnerFunctionWoAuth<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
) {
    return unauthenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        requestHandlerHelperInnerFunctionBuilder({
            sanitizeHeadersFunction,
            sanitizeParamsFunction,
            postExecutionFunction},
            innerFunction
        ),
    );
}

function requestHandlerHelperInnerFunctionBuilder<
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>({
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    }: {
        sanitizeHeadersFunction: SanitizeHeadersWoAuthFunction<CONTEXT, SANITIZED_HEADERS>,
        sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_HEADERS, SANITIZED_PARAMS>,
        postExecutionFunction?: PostExecutionFunction<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    },
    innerFunction: RequestHandlerInnerFunctionWoAuth<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>
): RequestHandlerBaseInnerFunctionWoAuth<SANITIZED_PARAMS, CONTEXT> {
    return async ({req, res, context}) => {
        const [headersErrors, headers] = await sanitizeHeadersFunction({unsanitizedHeaders: req.headers, context});
        if (headersErrors !== null) {
            res.status(400).json(errorResponse(headersErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context});
            return;
        }

        const [paramsErrors, params] = await sanitizeParamsFunction({unsanitizedParams: req.params, headers, context});
        if (paramsErrors !== null) {
            res.status(400).json(errorResponse(paramsErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, headers, context});
            return;
        }

        await innerFunction({req, res, context, params, headers});
    }
}

export function authenticatedEntityRequestHandlerHelper<
    ID,
    USER,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>(
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        idParamName: string,
        contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
        sanitizeIdFunction: SanitizeIdFunction<ID>,
        sanitizeHeadersFunction: SanitizeHeadersWithAuthWithIdFunction<ID, USER, CONTEXT, SANITIZED_HEADERS>,
        sanitizeParamsFunction:
            SanitizeParamsWithAuthWithIdFunction<ID, USER, CONTEXT, SANITIZED_HEADERS, SANITIZED_PARAMS>,
        postExecutionFunction?:
            PostExecutionFunctionWithUserWithId<ID, USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    },
    innerFunction: EntityRequestHandlerInnerFunctionWithAuth<ID, USER, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>
) {
    return authenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        async ({req, res, user, context}) =>
            entityRequestHandlerHelperInnerFunctionBuilder<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>(
                {
                    idParamName,
                    sanitizeIdFunction,
                    sanitizeHeadersFunction: async (param0) => await sanitizeHeadersFunction({user, ...param0}),
                    sanitizeParamsFunction: async (param0) => await sanitizeParamsFunction({user, ...param0}),
                    ...(postExecutionFunction
                        ? { postExecutionFunction: (param0) => postExecutionFunction({user, ...param0}) }
                        : {}
                    )
                },
                async (param0) => await innerFunction({user, ...param0})
            )({req, res, context})
    )
}

export function unauthenticatedEntityRequestHandlerHelper<
    ID,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>(
    {
        idParamName = 'id',
        contextCreateFunction,
        sanitizeIdFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        idParamName: string,
        contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
        sanitizeIdFunction: SanitizeIdFunction<ID>,
        sanitizeHeadersFunction: SanitizeHeadersWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_HEADERS>,
        sanitizeParamsFunction: SanitizeParamsWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_HEADERS, SANITIZED_PARAMS>,
        postExecutionFunction?: PostExecutionFunctionWithId<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    },
    innerFunction: EntityRequestHandlerInnerFunctionWoAuth<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
): RequestHandlerFunctionWoAuthReturnType<SANITIZED_PARAMS> {
    return unauthenticatedRequestHandlerHelperBase(
        { contextCreateFunction, postExecutionFunction },
        entityRequestHandlerHelperInnerFunctionBuilder<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>(
            { idParamName, sanitizeIdFunction, sanitizeHeadersFunction, sanitizeParamsFunction, postExecutionFunction },
            innerFunction
        )
    )
}

function entityRequestHandlerHelperInnerFunctionBuilder<
    ID,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    CONTEXT
>(
    {
        idParamName = 'id',
        sanitizeIdFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        postExecutionFunction,
    } : {
        idParamName: string,
        sanitizeIdFunction: SanitizeIdFunction<ID>,
        sanitizeHeadersFunction: SanitizeHeadersWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_HEADERS>,
        sanitizeParamsFunction: SanitizeParamsWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_HEADERS, SANITIZED_PARAMS>,
        postExecutionFunction?: PostExecutionFunctionWithId<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
    },
    innerFunction: EntityRequestHandlerInnerFunctionWoAuth<ID, SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>,
): RequestHandlerBaseInnerFunctionWoAuth<SANITIZED_PARAMS, CONTEXT> {
    return async ({req, res, context}) => {
        const idParam = (req.params as {[key in string]: string})[idParamName];
        if (idParam == undefined) {
            res.status(404).json(errorResponse([`No ${idParamName} provided`]));
            postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context});
            return;
        }

        const [submittedEntityIdErrors, submittedEntityId] = sanitizeIdFunction({idParam});
        if (submittedEntityIdErrors !== null) {
            res.status(404).json(errorResponse(submittedEntityIdErrors));
            postExecutionFunction && postExecutionFunction({status: 404, isSuccessful: false, context});
            return;
        } 

        await requestHandlerHelperInnerFunctionBuilder<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>(
            {
                sanitizeHeadersFunction: async (param0) => await sanitizeHeadersFunction({submittedEntityId, ...param0}),
                sanitizeParamsFunction: async (param0) => await sanitizeParamsFunction({submittedEntityId, ...param0}),
                postExecutionFunction,
            },
            async (param0) => await innerFunction({submittedEntityId, ...param0})
        )({req, res, context});
    }
}