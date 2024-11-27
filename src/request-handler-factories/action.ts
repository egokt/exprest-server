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
    }: ActionWithAuthRequestHandlerFactoryProps<
        USER, ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>
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
    
    export function actionWoAuth<
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
        }: ActionWoAuthRequestHandlerFactoryProps<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>
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
        postExecutionFunction?:
        ActionPostExecutionFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT>,
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
                        status, isSuccessful: true, context, params, body, actionResponseContent });
                    } else {
                        res.status(status).end();
                        postExecutionFunction && postExecutionFunction({
                            status, isSuccessful: true, context, params, body });
                        }
                    } else {
                        res.status(status).json(errorResponse(errors));
                        postExecutionFunction && postExecutionFunction({
                            status, isSuccessful: false, context, params, body });
                        }
                    };
                }
                