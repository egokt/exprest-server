import { SuccessfulActionResponse } from '@egokt/exprest-shared';
import express from 'express';
import { authenticatedResourceRequestHandlerHelper, unauthenticatedResourceRequestHandlerHelper } from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { actionResponse } from '../helpers/action-response.js';

type SanitizeParamsFunctionProps<USER, CONTEXT> = {
    unsanitizedParams: {[key in string]?: string},
    user: USER,
    context: CONTEXT
};
type SanitizeParamsFunctionReturnType<SANITIZED_PARAMS> = [Array<string>, null] | [null, SANITIZED_PARAMS];
type SanitizeParamsFunction<USER, CONTEXT, SANITIZED_PARAMS> =
    (param0: SanitizeParamsFunctionProps<USER, CONTEXT>) =>
        Promise<SanitizeParamsFunctionReturnType<SANITIZED_PARAMS>>
        | SanitizeParamsFunctionReturnType<SANITIZED_PARAMS>;

type CreateContextFunction<USER, CONTEXT> = (param0: {user: USER}) => CONTEXT | Promise<CONTEXT>;

export function authenticatedActionRequestHandlerFactory<
    USER, ACTION_RESPONSE_CONTENT extends Object | null, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT extends Object = {}
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        actionFunction,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: CreateContextFunction<USER, CONTEXT>,
        sanitizeParamsFunction: SanitizeParamsFunction<USER, CONTEXT, SANITIZED_PARAMS>,
        sanitizeBodyFunction: (param0: {unsanitizedBody: {[key in string]?: any}, user: USER, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<[Array<string>, null] | [null, SANITIZED_BODY]> | [Array<string>, null] | [null, SANITIZED_BODY],
        actionFunction: (
            param0: {
                user: USER,
                context: CONTEXT,
                params: SANITIZED_PARAMS,
                body: SANITIZED_BODY,
                rawExpressRequest: express.Request,
            }
        ) =>
            Promise<
                {status: number, isSuccessful: true, actionResponseContent: ACTION_RESPONSE_CONTENT | null, errors?: undefined}
                | {status: number, isSuccessful: false, actionResponseContent?: undefined, errors: Array<string>}
            >
            | (
                {status: number, isSuccessful: true, actionResponseContent: ACTION_RESPONSE_CONTENT | null, errors?: undefined}
                | {status: number, isSuccessful: false, actionResponseContent?: undefined, errors: Array<string>}
            ),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, user: USER, actionResponseContent?: ACTION_RESPONSE_CONTENT, body?: SANITIZED_BODY, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    }
): (req: express.Request, res: express.Response<ACTION_RESPONSE_CONTENT extends null ? null : SuccessfulActionResponse<ACTION_RESPONSE_CONTENT>>) => Promise<void> {
    return authenticatedResourceRequestHandlerHelper({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({req, res, user, context, params}) => {
        const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, user, context, params});
        if (bodyErrors !== null) {
            res.status(400).json(errorResponse(bodyErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, user, context, params});
            return;
        }

        const {status, isSuccessful, actionResponseContent, errors} = await actionFunction({user, context, params, body, rawExpressRequest: req});
        if (isSuccessful) {
            if (actionResponseContent !== null) {
                res.status(status).json(actionResponse(actionResponseContent));
                postExecutionFunction && postExecutionFunction({status: status, isSuccessful: true, user, context, params, body, actionResponseContent});
            } else {
                res.status(status).end();
                postExecutionFunction && postExecutionFunction({status: status, isSuccessful: true, user, context, params, body});
            }
        } else {
            res.status(status).json(errorResponse(errors));
            postExecutionFunction && postExecutionFunction({status: status, isSuccessful: false, user, context, params, body});
        }
    });
}

export function unauthenticatedActionRequestHandlerFactory<
    ACTION_RESPONSE_CONTENT extends Object | null, SANITIZED_PARAMS extends {[key: string]: string}, SANITIZED_BODY, CONTEXT extends Object = {}
> (
    {
        contextCreateFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        actionFunction,
        postExecutionFunction = undefined,
    }: {
        contextCreateFunction: (param0: {}) => CONTEXT | Promise<CONTEXT>,
        sanitizeParamsFunction: (param0: {unsanitizedParams: {[key in string]?: string}, context: CONTEXT}) => Promise<[Array<string>, null] | [null, SANITIZED_PARAMS]> | [Array<string>, null] | [null, SANITIZED_PARAMS],
        sanitizeBodyFunction: (param0: {unsanitizedBody: {[key in string]?: string}, context: CONTEXT, params: SANITIZED_PARAMS}) => Promise<[Array<string>, null] | [null, SANITIZED_BODY]> | [Array<string>, null] | [null, SANITIZED_BODY],
        actionFunction: (
            param0: {
                context: CONTEXT,
                params: SANITIZED_PARAMS,
                body: SANITIZED_BODY,
                rawExpressRequest: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>,
            }
        ) =>
            Promise<
                {status: number, isSuccessful: true, actionResponseContent: ACTION_RESPONSE_CONTENT | null, errors?: undefined}
                | {status: number, isSuccessful: false, actionResponseContent?: undefined, errors: Array<string>}
            >
            | (
                {status: number, isSuccessful: true, actionResponseContent: ACTION_RESPONSE_CONTENT | null, errors?: undefined}
                | {status: number, isSuccessful: false, actionResponseContent?: undefined, errors: Array<string>}
            ),
        postExecutionFunction?: (param0: {status: number, isSuccessful: boolean, actionResponseContent?: ACTION_RESPONSE_CONTENT, body?: SANITIZED_BODY, params?: SANITIZED_PARAMS, context: CONTEXT}) => void | Promise<void>,
    }
): (req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>, res: express.Response<ACTION_RESPONSE_CONTENT extends null ? null : SuccessfulActionResponse<ACTION_RESPONSE_CONTENT>>) => Promise<void> {
    return unauthenticatedResourceRequestHandlerHelper<SANITIZED_PARAMS, CONTEXT>({
        contextCreateFunction, sanitizeParamsFunction, postExecutionFunction
    }, async ({req, res, context, params}) => {
        const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, context, params});
        if (bodyErrors !== null) {
            res.status(400).json(errorResponse(bodyErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context, params});
            return;
        }

        const {status, isSuccessful, actionResponseContent, errors} = await actionFunction({context, params, body, rawExpressRequest: req});
        if (isSuccessful) {
            if (actionResponseContent !== null) {
                res.status(status).json(actionResponse(actionResponseContent));
                postExecutionFunction && postExecutionFunction({status: status, isSuccessful: true, context, params, body, actionResponseContent});
            } else {
                res.status(status).end();
                postExecutionFunction && postExecutionFunction({status: status, isSuccessful: true, context, params, body});
            }
        } else {
            res.status(status).json(errorResponse(errors));
            postExecutionFunction && postExecutionFunction({status: status, isSuccessful: false, context, params, body});
        }
    });
}

