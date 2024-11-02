import { ActionEndpoint } from "../../../src/endpoints/action.js";
import express from "express";

describe("Action endpoint", () => {
    it("defines a post endpoint", () => {
        testHelper("/test");
    });

    it("adds a leading slash to the mount path if it is missing", () => {
        testHelper("test", "/test");
    });

    it("does not add a leading slash to the mount path if it is already present", () => {
        testHelper("/test");
    });

    it("works with multi-segment paths", () => {
        testHelper("/test/test2");
    });
});

function testHelper(path: string, expectedPath: string = path) {
    const requestHandler = jest.fn();
    const actionEndpoint = new ActionEndpoint({ routerMountRelativePath: path, requestHandler });
    const router = { post: jest.fn(), } as unknown as express.Router;
    actionEndpoint.addToRouter(router);
    expect(router.post).toHaveBeenCalledWith(expectedPath, requestHandler);
}