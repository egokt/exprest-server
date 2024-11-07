import { ErrorResponse, } from "@egokt/exprest-shared";

export function errorResponse(errors: Array<string>): ErrorResponse {
    return { errors: errors, };
}
