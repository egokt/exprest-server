import { SuccessfulActionResponse, } from "@egokt/exprest-shared";

export function actionResponse<ACTION_RESPONSE_CONTENT>(
    actionResult: ACTION_RESPONSE_CONTENT
): SuccessfulActionResponse<ACTION_RESPONSE_CONTENT> {
    return { actionResult };
}
