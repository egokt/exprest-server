
export type CreateContextWithAuthFunction<USER, CONTEXT> = (param0: {user: USER}) => CONTEXT | Promise<CONTEXT>;
export type CreateContextWoAuthFunction<CONTEXT> = (param0: {}) => CONTEXT | Promise<CONTEXT>;

type SanitizeFunctionNonPromiseReturnType<SANITIZED> = [Array<string>, null] | [null, SANITIZED];
type SanitizeFunctionReturnType<SANITIZED> =
    Promise<SanitizeFunctionNonPromiseReturnType<SANITIZED>> | SanitizeFunctionNonPromiseReturnType<SANITIZED>;

export type SanitizeIdFunction<ID> = (param0: {idParam: string}) => SanitizeFunctionNonPromiseReturnType<ID>;

type SanitizeParamsWoAuthFunctionProps<CONTEXT> = {
    unsanitizedParams: {[key in string]?: string},
    context: CONTEXT
};
export type SanitizeParamsWoAuthFunction<CONTEXT, SANITIZED_PARAMS> =
    (param0: SanitizeParamsWoAuthFunctionProps<CONTEXT>) => SanitizeFunctionReturnType<SANITIZED_PARAMS>;

type SanitizeParamsWoAuthWithIdFunctionProps<ID, CONTEXT> =
    SanitizeParamsWoAuthFunctionProps<CONTEXT> & { submittedEntityId: ID, };
export type SanitizeParamsWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_PARAMS> =
    (param0: SanitizeParamsWoAuthWithIdFunctionProps<ID, CONTEXT>) => SanitizeFunctionReturnType<SANITIZED_PARAMS>;

type SanitizeParamsWithAuthFunctionProps<USER, CONTEXT> = SanitizeParamsWoAuthFunctionProps<CONTEXT> & { user: USER, };
export type SanitizeParamsWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS> =
    (param0: SanitizeParamsWithAuthFunctionProps<USER, CONTEXT>) => SanitizeFunctionReturnType<SANITIZED_PARAMS>;

type SanitizeParamsWithAuthWithIdFunctionProps<ID, USER, CONTEXT> =
    SanitizeParamsWoAuthWithIdFunctionProps<ID, CONTEXT> & { user: USER, };
export type SanitizeParamsWithAuthWithIdFunction<ID, USER, CONTEXT, SANITIZED_PARAMS> =
    (param0: SanitizeParamsWithAuthWithIdFunctionProps<ID, USER, CONTEXT>)
        => SanitizeFunctionReturnType<SANITIZED_PARAMS>;

type SanitizeBodyWoAuthFunctionProps<CONTEXT, SANITIZED_PARAMS> = {
    unsanitizedBody: {[key in string]?: any},
    context: CONTEXT,
    params: SANITIZED_PARAMS
};
export type SanitizeBodyWoAuthFunction<CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY> =
    (param0: SanitizeBodyWoAuthFunctionProps<CONTEXT, SANITIZED_PARAMS>) => SanitizeFunctionReturnType<SANITIZED_BODY>;

type SanitizeBodyWithAuthFunctionProps<USER, CONTEXT, SANITIZED_PARAMS> =
    SanitizeBodyWoAuthFunctionProps<CONTEXT, SANITIZED_PARAMS> & { user: USER, };
export type SanitizeBodyWithAuthFunction<USER, CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY> =
    (param0: SanitizeBodyWithAuthFunctionProps<USER, CONTEXT, SANITIZED_PARAMS>) =>
        SanitizeFunctionReturnType<SANITIZED_BODY>;

type PostExecutionFunctionWoAuthWoBodyProps<SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> = {
    status: number,
    isSuccessful: boolean,
    params?: SANITIZED_PARAMS,
    context: CONTEXT
} & EXTENSION;
export type PostExecutionFunctionWoAuthWoBody<SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    (param0: PostExecutionFunctionWoAuthWoBodyProps<SANITIZED_PARAMS, CONTEXT, EXTENSION>) => void | Promise<void>;

type PostExecutionFunctionWoAuthWoBodyWithIdProps<ID, SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    PostExecutionFunctionWoAuthWoBodyProps<SANITIZED_PARAMS, CONTEXT, EXTENSION> & { submittedEntityId?: ID, };
export type PostExecutionFunctionWoAuthWoBodyWithId<ID, SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    (param0: PostExecutionFunctionWoAuthWoBodyWithIdProps<ID, SANITIZED_PARAMS, CONTEXT, EXTENSION>)
        => void | Promise<void>;

type PostExecutionFunctionWoAuthWithBodyProps<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, EXTENSION = {}> =
    PostExecutionFunctionWoAuthWoBodyProps<SANITIZED_PARAMS, CONTEXT, EXTENSION> & { body?: SANITIZED_BODY, };
export type PostExecutionFunctionWoAuthWithBody<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, EXTENSION = {}> =
    (param0: PostExecutionFunctionWoAuthWithBodyProps<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, EXTENSION>)
        => void | Promise<void>;

type PostExecutionFunctionWithAuthWoBodyProps<USER, SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    PostExecutionFunctionWoAuthWoBodyProps<SANITIZED_PARAMS, CONTEXT, EXTENSION & { user: USER, }>;
export type PostExecutionFunctionWithAuthWoBody<USER, SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    (param0: PostExecutionFunctionWithAuthWoBodyProps<USER, SANITIZED_PARAMS, CONTEXT, EXTENSION>)
        => void | Promise<void>;

type PostExecutionFunctionWithAuthWoBodyWithIdProps<ID, USER, SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    PostExecutionFunctionWoAuthWoBodyWithIdProps<ID, SANITIZED_PARAMS, CONTEXT, EXTENSION & { user: USER, }>;
export type PostExecutionFunctionWithAuthWoBodyWithId<ID, USER, SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    (param0: PostExecutionFunctionWithAuthWoBodyWithIdProps<ID, USER, SANITIZED_PARAMS, CONTEXT, EXTENSION>)
        => void | Promise<void>;

type PostExecutionFunctionWithAuthWithBodyProps<USER, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, EXTENSION = {}> =
    PostExecutionFunctionWoAuthWithBodyProps<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, EXTENSION & { user: USER, }>;
export type PostExecutionFunctionWithAuthWithBody<USER, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, EXTENSION = {}> =
    (param0: PostExecutionFunctionWithAuthWithBodyProps<USER, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT, EXTENSION>)
        => void | Promise<void>;

