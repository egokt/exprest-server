import { addActionRoute } from "../../src/router-helpers";
import express from "express";

describe("Action request handler router helper", () => {
    it("defines a post endpoint", () => {
        actionTestHelper("/test");
    });

    it("works with multi-segment paths", () => {
        actionTestHelper("/test/test2");
    });
});

function actionTestHelper(path: string, expectedPath: string = path) {
    const requestHandler = jest.fn();
    const router = { post: jest.fn(), } as unknown as express.Router;
    const actionEndpoint = addActionRoute(router, path, requestHandler);
    expect(router.post).toHaveBeenCalledWith(expectedPath, requestHandler);
}