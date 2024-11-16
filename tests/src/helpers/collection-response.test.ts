import { collectionResponse } from "../../../src/helpers/collection-response";

describe("collectionResponse", () => {
    it("wraps the collection in an object with collection key", () => {
        const result = ["result", "more results"];
        const response = collectionResponse(result);
        expect(response).toEqual({ collection: result });
    });

    it("adds other data if provided", () => {
        const result = ["result", "more results"];
        const response = collectionResponse(result, { something: "other data" });
        expect(response).toEqual({ collection: result, other_data: { something: "other data" } });
    });
});