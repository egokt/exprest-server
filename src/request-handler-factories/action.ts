import { SuccessfulActionResponse } from '@egokt/exprest-shared';
import express from 'express';
import {
    authenticatedResourceRequestHandlerHelper,
    RequestHandlerInnerFunctionWoAuth,
    unauthenticatedResourceRequestHandlerHelper,
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { actionResponse } from '../helpers/action-response.js';
import {
    CreateContextWithAuthFunction,
    CreateContextWoAuthFunction,
    PostExecutionFunctionWithAuthWithBody,
    PostExecutionFunctionWoAuthWithBody,
    SanitizeBodyWithAuthFunction,
    SanitizeBodyWoAuthFunction,
    SanitizeParamsWithAuthFunction,
    SanitizeParamsWoAuthFunction,
} from './types.js';

type ActionFunctionWoAuthProps<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> = {
    context: CONTEXT,
    params: SANITIZED_PARAMS,
    body: SANITIZED_BODY,
    rawExpressRequest: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>,
};
type ActionFunctionWithAuthProps<USER, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    ActionFunctionWoAuthProps<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> & { user: USER, };

type ActionFunctionNonPromiseReturnType<ACTION_RESPONSE_CONTENT> =
    {status: number, isSuccessful: true, actionResponseContent: ACTION_RESPONSE_CONTENT | null, errors?: undefined}
        | {status: number, isSuccessful: false, actionResponseContent?: undefined, errors: Array<string>};
type ActionFunctionReturnType<ACTION_RESPONSE_CONTENT> =
    Promise<ActionFunctionNonPromiseReturnType<ACTION_RESPONSE_CONTENT>>
        | ActionFunctionNonPromiseReturnType<ACTION_RESPONSE_CONTENT>;

type ActionFunctionWithAuth<USER, ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    (param0: ActionFunctionWithAuthProps<USER, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>) =>
        ActionFunctionReturnType<ACTION_RESPONSE_CONTENT>;

type ActionFunctionWoAuth<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    (param0: ActionFunctionWoAuthProps<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>) =>
        ActionFunctionReturnType<ACTION_RESPONSE_CONTENT>;

type ActionPostExecutionFunctionWoAuth<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunctionWoAuthWithBody<
        SANITIZED_PARAMS,
        SANITIZED_BODY,
        CONTEXT,
        { actionResponseContent?: ACTION_RESPONSE_CONTENT}>;
type ActionPostExecutionFunctionWithAuth<USER, ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunctionWithAuthWithBody<
        USER,
        SANITIZED_PARAMS,
        SANITIZED_BODY,
        CONTEXT,
        { actionResponseContent?: ACTION_RESPONSE_CONTENT }>;

type ActionRequestHandlerFactoryWoAuthProps<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> = {
    contextCreateFunction: CreateContextWoAuthFunction<CONTEXT>,
    sanitizeParamsFunction: SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_PARAMS>,
    sanitizeBodyFunction: SanitizeBodyWoAuthFunction<CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY>,
    actionFunction: ActionFunctionWoAuth<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    postExecutionFunction?:
        ActionPostExecutionFunctionWoAuth<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
};

type ActionRequestHandlerFactoryWithAuthProps<
    USER,
    ACTION_RESPONSE_CONTENT,
    SANITIZED_PARAMS,
    SANITIZED_BODY,
    CONTEXT
> = {
    contextCreateFunction: CreateContextWithAuthFunction<USER, CONTEXT>,
    sanitizeParamsFunction: SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS>,
    sanitizeBodyFunction: SanitizeBodyWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY>,
    actionFunction: ActionFunctionWithAuth<USER, ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    postExecutionFunction?:
        ActionPostExecutionFunctionWithAuth<USER, ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
};

type ActionRequestHandlerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS> =
    (
        req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>,
        res: express.Response<
            ACTION_RESPONSE_CONTENT extends null ? null : SuccessfulActionResponse<ACTION_RESPONSE_CONTENT>
        >
    ) => Promise<void>;

export function authenticatedActionRequestHandlerFactory<
    USER,
    ACTION_RESPONSE_CONTENT extends Object | null,
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {}
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        actionFunction,
        postExecutionFunction = undefined,
    }: ActionRequestHandlerFactoryWithAuthProps<USER, ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>
): ActionRequestHandlerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS> {
    return authenticatedResourceRequestHandlerHelper(
        {
            contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
        },
        async ({req, res, user, context, params}) =>
            unauthenticatedInnerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>({
                sanitizeBodyFunction: async (param0) => await sanitizeBodyFunction({...param0, user}),
                actionFunction: async (param0) => await actionFunction({...param0, user}),
                ...(postExecutionFunction
                    ? {postExecutionFunction: (param0) => postExecutionFunction({...param0, user})}
                    : {}),
            })({req, res, context, params})
    );
}

export function unauthenticatedActionRequestHandlerFactory<
    ACTION_RESPONSE_CONTENT extends Object | null,
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {}
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        actionFunction,
        postExecutionFunction = undefined,
    }: ActionRequestHandlerFactoryWoAuthProps<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>
): ActionRequestHandlerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS> {
    return unauthenticatedResourceRequestHandlerHelper<SANITIZED_PARAMS, CONTEXT>(
        {
            contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
        },
        unauthenticatedInnerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>({
            sanitizeBodyFunction,
            actionFunction,
            postExecutionFunction,
        }),
    );
}

function unauthenticatedInnerFunction<
    ACTION_RESPONSE_CONTENT extends Object | null,
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {}
>({
    sanitizeBodyFunction,
    actionFunction,
    postExecutionFunction = undefined,
}: {
    sanitizeBodyFunction: SanitizeBodyWoAuthFunction<CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY>,
    actionFunction: ActionFunctionWoAuth<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    postExecutionFunction?: ActionPostExecutionFunctionWoAuth<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
}): RequestHandlerInnerFunctionWoAuth<SANITIZED_PARAMS, CONTEXT> {
    return async ({req, res, context, params}) => {
        const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, context, params});
        if (bodyErrors !== null) {
            res.status(400).json(errorResponse(bodyErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context, params});
            return;
        }

        const {status, isSuccessful, actionResponseContent, errors} =
            await actionFunction({context, params, body, rawExpressRequest: req});
        if (isSuccessful) {
            if (actionResponseContent !== null) {
                res.status(status).json(actionResponse(actionResponseContent));
                postExecutionFunction && postExecutionFunction({
                    status,
                    isSuccessful: true,
                    context,
                    params,
                    body,
                    actionResponseContent
                });
            } else {
                res.status(status).end();
                postExecutionFunction && postExecutionFunction({
                    status,
                    isSuccessful: true,
                    context,
                    params,
                    body
                });
            }
        } else {
            res.status(status).json(errorResponse(errors));
            postExecutionFunction && postExecutionFunction({
                status,
                isSuccessful: false,
                context,
                params,
                body
            });
        }
    };
}
