import { SuccessfulEntityResponse, SuccessfulEntityResponseWithOtherData } from "@egokt/exprest-shared";
import express from "express";

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

type SanitizeBodyWoAuthWithIdFunctionProps<ID, CONTEXT, SANITIZED_PARAMS> =
    SanitizeBodyWoAuthFunctionProps<CONTEXT, SANITIZED_PARAMS> & { submittedEntityId: ID, };
export type SanitizeBodyWoAuthWithIdFunction<ID, CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY> =
    (param0: SanitizeBodyWoAuthWithIdFunctionProps<ID, CONTEXT, SANITIZED_PARAMS>) =>
        SanitizeFunctionReturnType<SANITIZED_BODY>;

type SanitizeBodyWithAuthWithIdFunctionProps<ID, USER, CONTEXT, SANITIZED_PARAMS> =
    SanitizeBodyWoAuthWithIdFunctionProps<ID, CONTEXT, SANITIZED_PARAMS> & { user: USER, };
export type SanitizeBodyWithAuthWithIdFunction<ID, USER, CONTEXT, SANITIZED_PARAMS, SANITIZED_BODY> =
    (param0: SanitizeBodyWithAuthWithIdFunctionProps<ID, USER, CONTEXT, SANITIZED_PARAMS>) =>
        SanitizeFunctionReturnType<SANITIZED_BODY>;

type ConvertToFrontEndEntityWoAuthFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> = {
    entity: ENTITY,
    context: CONTEXT,
    params: SANITIZED_PARAMS,
};
export type ConvertToFrontEndEntityWoAuthFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    (param0: ConvertToFrontEndEntityWoAuthFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY;

type ConvertToFrontEndEntityWoAuthWithIdFunctionProps<ID, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    ConvertToFrontEndEntityWoAuthFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> & { submittedEntityId: ID, };
export type ConvertToFrontEndEntityWoAuthWithIdFunction<ID, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    (param0: ConvertToFrontEndEntityWoAuthWithIdFunctionProps<ID, ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY;

type ConvertToFrontEndEntityWithAuthFunctionProps<USER, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    ConvertToFrontEndEntityWoAuthFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> & {user: USER};
export type ConvertToFrontEndEntityWithAuthFunction<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    (param0: ConvertToFrontEndEntityWithAuthFunctionProps<USER, ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY;

type ConvertToFrontEndEntityWithAuthWithIdFunctionProps<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    ConvertToFrontEndEntityWoAuthWithIdFunctionProps<ID, ENTITY, SANITIZED_PARAMS, CONTEXT> & {user: USER};
export type ConvertToFrontEndEntityWithAuthWithIdFunction<
    ID, USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT
> =
    (param0: ConvertToFrontEndEntityWithAuthWithIdFunctionProps<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => Promise<FRONT_END_ENTITY> | FRONT_END_ENTITY;

type OtherDataFunctionReturnType<OTHER_DATA> =
    OTHER_DATA extends null ? (Promise<void> | void) : (Promise<OTHER_DATA> | OTHER_DATA);
type OtherDataBaseFunctionProps<SANITIZED_PARAMS, CONTEXT> = {
    context: CONTEXT,
    params: SANITIZED_PARAMS,
};

type OtherDataWoAuthWithEntitiesFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> =
    OtherDataBaseFunctionProps<SANITIZED_PARAMS, CONTEXT> & {entities: Array<ENTITY>};
export type OtherDataWoAuthWithEntitiesFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA> =
    (param0: OtherDataWoAuthWithEntitiesFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => OtherDataFunctionReturnType<OTHER_DATA>;

type OtherDataWithAuthWithEntitiesFunctionProps<USER, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    OtherDataWoAuthWithEntitiesFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> & {user: USER};
export type OtherDataWithAuthWithEntitiesFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA> =
    (param0: OtherDataWithAuthWithEntitiesFunctionProps<USER, ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => OtherDataFunctionReturnType<OTHER_DATA>;

type OtherDataWoAuthWithEntityFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> =
    OtherDataBaseFunctionProps<SANITIZED_PARAMS, CONTEXT> & { entity: ENTITY, };
export type OtherDataWoAuthWithEntityFunction<ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA> =
    (param0: OtherDataWoAuthWithEntityFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => OtherDataFunctionReturnType<OTHER_DATA>;

type OtherDataWithAuthWithEntityFunctionProps<USER, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    OtherDataWoAuthWithEntityFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> & {user: USER};
export type OtherDataWithAuthWithEntityFunction<USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA> =
    (param0: OtherDataWithAuthWithEntityFunctionProps<USER, ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => OtherDataFunctionReturnType<OTHER_DATA>;

type OtherDataWoAuthWithEntityWithIdFunctionProps<ID, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    OtherDataWoAuthWithEntityFunctionProps<ENTITY, SANITIZED_PARAMS, CONTEXT> & { submittedEntityId: ID, };
export type OtherDataWoAuthWithEntityWithIdFunction<ID, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA> =
    (param0: OtherDataWoAuthWithEntityWithIdFunctionProps<ID, ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => OtherDataFunctionReturnType<OTHER_DATA>;

type OtherDataWithAuthWithEntityWithIdFunctionProps<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT> =
    OtherDataWoAuthWithEntityWithIdFunctionProps<ID, ENTITY, SANITIZED_PARAMS, CONTEXT> & {user: USER};
export type OtherDataWithAuthWithEntityWithIdFunction<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT, OTHER_DATA> =
    (param0: OtherDataWithAuthWithEntityWithIdFunctionProps<ID, USER, ENTITY, SANITIZED_PARAMS, CONTEXT>)
        => OtherDataFunctionReturnType<OTHER_DATA>;

type PostExecutionFunctionProps<SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> = {
    status: number,
    isSuccessful: boolean,
    params?: SANITIZED_PARAMS,
    context: CONTEXT
} & EXTENSION;
export type PostExecutionFunction<SANITIZED_PARAMS, CONTEXT, EXTENSION = {}> =
    (param0: PostExecutionFunctionProps<SANITIZED_PARAMS, CONTEXT, EXTENSION>) => void | Promise<void>;
export type PostExecutionFunctionWithEntity<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT, { entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type PostExecutionFunctionWithEntities<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT,
        { entities?: Array<ENTITY>, feEntities?: Array<FRONT_END_ENTITY> }>;
export type PostExecutionFunctionWithId<ID, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT, { submittedEntityId?: ID, }>;
export type PostExecutionFunctionWithIdWithEntity<ID, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT,
        { submittedEntityId?: ID, entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type PostExecutionFunctionWithBody<SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT, { body?: SANITIZED_BODY, }>;
export type PostExecutionFunctionWithBodyWithEntity<
    ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunction<
        SANITIZED_PARAMS, CONTEXT, { body?: SANITIZED_BODY, entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type PostExecutionFunctionWithBodyWithEntityWithId<
    ID, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunction<
        SANITIZED_PARAMS, CONTEXT,
        { submittedEntityId?: ID, body?: SANITIZED_BODY, entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type PostExecutionFunctionWithUser<USER, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT, { user: USER }>;
export type PostExecutionFunctionWithUserWithEntities<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT,
        { user: USER, entities?: Array<ENTITY>, feEntities?: Array<FRONT_END_ENTITY> }>;
export type PostExecutionFunctionWithUserWithBodyWithEntity<
    USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunction<
        SANITIZED_PARAMS, CONTEXT,
        { user: USER, body?: SANITIZED_BODY, entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type PostExecutionFunctionWithUserWithBodyWithEntityWithId<
    ID, USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunction<
        SANITIZED_PARAMS, CONTEXT,
        { user: USER, submittedEntityId?: ID, body?: SANITIZED_BODY, entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type PostExecutionFunctionWithUserWithEntity<USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT, { user: USER, entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type PostExecutionFunctionWithUserWithId<ID, USER, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT, { user: USER, submittedEntityId?: ID, }>;
export type PostExecutionFunctionWithUserWithIdWithEntity<ID, USER, ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, CONTEXT> =
    PostExecutionFunction<SANITIZED_PARAMS, CONTEXT,
        { user: USER, submittedEntityId?: ID, entity?: ENTITY, feEntity?: FRONT_END_ENTITY }>;
export type ActionPostExecutionFunction<ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunction<
        SANITIZED_PARAMS, CONTEXT, { body?: SANITIZED_BODY, actionResponseContent?: ACTION_RESPONSE_CONTENT }>;
export type ActionPostExecutionFunctionWithUser<USER, ACTION_RESPONSE_CONTENT, SANITIZED_PARAMS, SANITIZED_BODY, CONTEXT> =
    PostExecutionFunction<
        SANITIZED_PARAMS, CONTEXT,
        { user: USER, body?: SANITIZED_BODY, actionResponseContent?: ACTION_RESPONSE_CONTENT }>;

type EntityReturningExpressResponseType<ENTITY, FRONT_END_ENTITY, OTHER_DATA> =
    express.Response<
        OTHER_DATA extends never
            ? SuccessfulEntityResponse<FRONT_END_ENTITY>
            : SuccessfulEntityResponseWithOtherData<ENTITY, OTHER_DATA>
    >;
export type EntityReturningRequestHandlerFunction<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null
> =
    (
        req: express.Request<{[key in keyof SANITIZED_PARAMS]?: string}>,
        res: EntityReturningExpressResponseType<ENTITY, FRONT_END_ENTITY, OTHER_DATA>
    ) => Promise<void>;
