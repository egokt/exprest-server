import { actionResponse } from "../../../src/helpers/action-response";

describe("actionResponse", () => {
    it("wraps the result in an object with actionResult key", () => {
        const response = actionResponse("result");
        expect(response).toEqual({ actionResult: "result" });
    });
});