import { errorResponse } from "../../../src/helpers/error-response";

describe("errorResponse", () => {
    it("wraps the errors in an object with errors key", () => {
        const errors = ["error1", "error2"];
        const response = errorResponse(errors);
        expect(response).toEqual({ errors: errors });
    });
});