import { entityResponse } from "../../../src/helpers/entity-response.js";

describe("entityResponse", () => {
    it("doesn't include otherData when not provided", () => {
        const response = entityResponse("entity");
        expect(response).toEqual({ entity: "entity" });
        expect(response).not.toHaveProperty("other_data");
    });

    it("includes otherData when provided", () => {
        const response = entityResponse("entity", "otherData");
        expect(response).toEqual({ entity: "entity", other_data: "otherData" });
    });
});
