import {
    ActionFunctionWoAuth,
    ActionPostExecutionFunction,
    ActionRequestHandlerFunction,
    ActionWithAuthRequestHandlerFactoryProps,
    ActionWoAuthRequestHandlerFactoryProps,
    SanitizeBodyWoAuthFunction
} from 'exprest-shared';
import {
    authenticatedResourceRequestHandlerHelper,
    RequestHandlerInnerFunctionWoAuth,
    unauthenticatedResourceRequestHandlerHelper,
} from './request-handler-helpers.js';
import { errorResponse } from '../helpers/error-response.js';
import { actionResponse } from '../helpers/action-response.js';

export function actionWithAuth<
    USER,
    ACTION_RESPONSE_CONTENT extends Object | null,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {}
> (
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        actionFunction,
        postExecutionFunction = undefined,
    }: ActionWithAuthRequestHandlerFactoryProps<
        USER, ACTION_RESPONSE_CONTENT, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>
): ActionRequestHandlerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS> {
    return authenticatedResourceRequestHandlerHelper(
        {
            contextCreateFunction, sanitizeHeadersFunction, sanitizeParamsFunction, postExecutionFunction
        },
        async ({req, res, user, context, headers, params}) =>
            unauthenticatedInnerFunction<
                ACTION_RESPONSE_CONTENT, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT
            >({
                sanitizeBodyFunction: async (param0) => await sanitizeBodyFunction({...param0, user}),
                actionFunction: async (param0) => await actionFunction({...param0, user}),
                ...(postExecutionFunction
                    ? {postExecutionFunction: (param0) => postExecutionFunction({...param0, user})}
                    : {}),
            })({req, res, context, headers, params})
    );
}
    
export function actionWoAuth<
    ACTION_RESPONSE_CONTENT extends Object | null,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {}
> (
    {
        contextCreateFunction,
        sanitizeHeadersFunction,
        sanitizeParamsFunction,
        sanitizeBodyFunction,
        actionFunction,
        postExecutionFunction = undefined,
    }: ActionWoAuthRequestHandlerFactoryProps<ACTION_RESPONSE_CONTENT, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>
): ActionRequestHandlerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS> {
    return unauthenticatedResourceRequestHandlerHelper<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT>(
        {
            contextCreateFunction, sanitizeHeadersFunction, sanitizeParamsFunction, postExecutionFunction
        },
        unauthenticatedInnerFunction<ACTION_RESPONSE_CONTENT, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>({
            sanitizeBodyFunction,
            actionFunction,
            postExecutionFunction,
        }),
    );
}

function unauthenticatedInnerFunction<
    ACTION_RESPONSE_CONTENT extends Object | null,
    SANITIZED_HEADERS extends {[key: string]: string},
    SANITIZED_PARAMS extends {[key: string]: string},
    SANITIZED_BODY,
    CONTEXT extends Object = {}
>({
    sanitizeBodyFunction,
    actionFunction,
    postExecutionFunction = undefined,
}: {
    sanitizeBodyFunction: SanitizeBodyWoAuthFunction<CONTEXT, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY>,
    actionFunction: ActionFunctionWoAuth<ACTION_RESPONSE_CONTENT, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
    postExecutionFunction?:
    ActionPostExecutionFunction<ACTION_RESPONSE_CONTENT, SANITIZED_HEADERS, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
}): RequestHandlerInnerFunctionWoAuth<SANITIZED_HEADERS, SANITIZED_PARAMS, CONTEXT> {
    return async ({req, res, context, headers, params}) => {
        const [bodyErrors, body] = await sanitizeBodyFunction({unsanitizedBody: req.body, context, headers, params});
        if (bodyErrors !== null) {
            res.status(400).json(errorResponse(bodyErrors));
            postExecutionFunction && postExecutionFunction({status: 400, isSuccessful: false, context, headers, params});
            return;
        }
        
        const {status, isSuccessful, actionResponseContent, errors} =
            await actionFunction({context, params, body, headers, rawExpressRequest: req});
        if (isSuccessful) {
            if (actionResponseContent !== null) {
                res.status(status).json(actionResponse(actionResponseContent));
                postExecutionFunction && postExecutionFunction({
                    status, isSuccessful: true, context, headers, params, body, actionResponseContent });
            } else {
                res.status(status).end();
                postExecutionFunction && postExecutionFunction({
                    status, isSuccessful: true, context, headers, params, body });
            }
        } else {
            res.status(status).json(errorResponse(errors));
            postExecutionFunction && postExecutionFunction({ status, isSuccessful: false, context, headers, params, body });
        }
    };
}
            