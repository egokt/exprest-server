import {
    SuccessfulCollectionResponse,
    SuccessfulCollectionResponseWithOtherData,
} from "@egokt/exprest-shared";

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

