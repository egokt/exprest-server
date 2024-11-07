import {
    SuccessfulEntityResponse,
    SuccessfulEntityResponseWithOtherData,
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
