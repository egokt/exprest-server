import {
    SuccessfulEntityResponse,
    SuccessfulEntityResponseWithOtherData,
    SuccessfulCollectionResponse,
    SuccessfulCollectionResponseWithOtherData,
    SuccessfulActionResponse,
    ErrorResponse,
} from "@egokt/exprest-shared";

export function entityResponse<FEM_TYPE>(
    entity: FEM_TYPE
): SuccessfulEntityResponse<FEM_TYPE>;
export function entityResponse<FEM_TYPE, OTHER_DATA_TYPE>(
    entity: FEM_TYPE,
    otherData: OTHER_DATA_TYPE,
): SuccessfulEntityResponseWithOtherData<FEM_TYPE, OTHER_DATA_TYPE>;
export function entityResponse<FEM_TYPE, OTHER_DATA_TYPE>(
    entity: FEM_TYPE,
    otherData?: OTHER_DATA_TYPE,
): { entity: FEM_TYPE, other_data?: OTHER_DATA_TYPE } {
    if (otherData === undefined) {
        return { entity: entity, } as SuccessfulEntityResponse<FEM_TYPE>;
    } else {
        return {
            entity: entity,
            other_data: otherData,
        } as SuccessfulEntityResponseWithOtherData<FEM_TYPE, OTHER_DATA_TYPE>;
    }
}

export function collectionResponse<FEM_TYPE>(
    collection: Array<FEM_TYPE>
): SuccessfulCollectionResponse<FEM_TYPE>;
export function collectionResponse<FEM_TYPE, OTHER_DATA_TYPE>(
    collection: Array<FEM_TYPE>,
    otherData: OTHER_DATA_TYPE,
): SuccessfulCollectionResponseWithOtherData<FEM_TYPE, OTHER_DATA_TYPE>;
export function collectionResponse<FEM_TYPE, OTHER_DATA_TYPE>(
    collection: Array<FEM_TYPE>,
    otherData?: OTHER_DATA_TYPE,
): { collection: Array<FEM_TYPE>, other_data?: OTHER_DATA_TYPE } {
    if (otherData === undefined) {
        return { collection: collection, } as SuccessfulCollectionResponse<FEM_TYPE>;
    } else {
        return {
            collection: collection,
            other_data: otherData,
        } as SuccessfulCollectionResponseWithOtherData<FEM_TYPE, OTHER_DATA_TYPE>;
    }
}

export function actionResponse<ACTION_RESPONSE_CONTENT>(
    actionResult: ACTION_RESPONSE_CONTENT
): SuccessfulActionResponse<ACTION_RESPONSE_CONTENT> {
    return { actionResult };
}

export function errorResponse(errors: Array<string>): ErrorResponse {
    return { errors: errors, };
}
