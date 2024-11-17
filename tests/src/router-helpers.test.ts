import { addActionRoute, addCreateRoute, addDeleteEntityRoute, addDeleteSingletonRoute, addGetCollectionRoute, addGetEntityRoute, addGetSingletonRoute, addUpdateEntityRoute, addUpdateSingletonRoute } from "../../src/router-helpers";
import express from "express";

describe("Action request handler router helper", () => {
    it("defines a post endpoint", () => { postTestHelper(addActionRoute, "/test"); });
    it("works with multi-segment paths", () => { postTestHelper(addActionRoute, "/test/with/multiple/segments"); });
});

describe("Create request handler router helper", () => {
    it("defines a post endpoint", () => { postTestHelper(addCreateRoute, "/test"); });
    it("works with multi-segment paths", () => { postTestHelper(addCreateRoute, "/test/with/multiple/segments"); });
});

describe("Delete-entity request handler router helper", () => {
    it("defines a delete-entity endpoint", () => { deleteEntityTestHelper(addDeleteEntityRoute, "/test", "/test/:id"); });
    it("works with multi-segment paths", () => {
        deleteEntityTestHelper(addDeleteEntityRoute, "/test/with/multiple/segments/:id");
    });
});

describe("Delete-singleton request handler router helper", () => {
    it("defines a delete-singleton endpoint", () => {
        deleteSingletonTestHelper(addDeleteSingletonRoute, "/test", "/test");
    });
    it("works with multi-segment paths", () => {
        deleteSingletonTestHelper(addDeleteSingletonRoute, "/test/with/multiple/segments");
    });
});

describe("Get-collection request handler router helper", () => {
    it("defines a get endpoint", () => { getTestHelper(addGetCollectionRoute, "/test"); });
    it("works with multi-segment paths", () => {
        getTestHelper(addGetCollectionRoute, "/test/with/multiple/segments");
    });
});

describe("Get-entity request handler router helper", () => {
    it("defines a get endpoint", () => { getEntityTestHelper(addGetEntityRoute, "/test/:id"); });
    it("works with multi-segment paths", () => {
        getEntityTestHelper(addGetEntityRoute, "/test/with/multiple/segments/:id");
    });
});

describe("Get-singleton request handler router helper", () => {
    it("defines a get endpoint", () => { getTestHelper(addGetSingletonRoute, "/test"); });
    it("works with multi-segment paths", () => {
        getTestHelper(addGetSingletonRoute, "/test/with/multiple/segments");
    });
});

describe("Update-entity request handler router helper", () => {
    it("defines a put endpoint", () => { putEntityTestHelper(addUpdateEntityRoute, "/test/:id"); });
    it("works with multi-segment paths", () => {
        putEntityTestHelper(addUpdateEntityRoute, "/test/with/multiple/segments/:id");
    });
});

describe("Update-singleton request handler router helper", () => {
    it("defines a get endpoint", () => { putTestHelper(addUpdateSingletonRoute, "/test"); });
    it("works with multi-segment paths", () => {
        putTestHelper(addUpdateSingletonRoute, "/test/with/multiple/segments");
    });
});

type RouteFunction = (router: express.Router, path: string, requestHandler: any) => void;
type EntityRouteFunction = (idParamName: string, router: express.Router, path: string, requestHandler: any) => void;

function deleteSingletonTestHelper(routeFunction: RouteFunction, path: string, expectedPath: string = path) {
    const {router, requestHandler} = routeTestHelper(routeFunction, path);
    expect(router.delete).toHaveBeenCalledWith(expectedPath, requestHandler);
}

function deleteEntityTestHelper(routeFunction: EntityRouteFunction, path: string, expectedPath: string = path) {
    const {router, requestHandler} = entityRouteTestHelper(routeFunction, path);
    expect(router.delete).toHaveBeenCalledWith(expectedPath, requestHandler);
}

function postTestHelper(routeFunction: RouteFunction, path: string, expectedPath: string = path) {
    const {router, requestHandler} = routeTestHelper(routeFunction, path);
    expect(router.post).toHaveBeenCalledWith(expectedPath, requestHandler);
}

function getTestHelper(routeFunction: RouteFunction, path: string, expectedPath: string = path) {
    const {router, requestHandler} = routeTestHelper(routeFunction, path);
    expect(router.get).toHaveBeenCalledWith(expectedPath, requestHandler);
}

function getEntityTestHelper(routeFunction: EntityRouteFunction, path: string, expectedPath: string = path) {
    const {router, requestHandler} = entityRouteTestHelper(routeFunction, path);
    expect(router.get).toHaveBeenCalledWith(expectedPath, requestHandler);
}

function putTestHelper(routeFunction: RouteFunction, path: string, expectedPath: string = path) {
    const {router, requestHandler} = routeTestHelper(routeFunction, path);
    expect(router.put).toHaveBeenCalledWith(expectedPath, requestHandler);
}

function putEntityTestHelper(routeFunction: EntityRouteFunction, path: string, expectedPath: string = path) {
    const {router, requestHandler} = entityRouteTestHelper(routeFunction, path);
    expect(router.put).toHaveBeenCalledWith(expectedPath, requestHandler);
}

function routeTestHelper(routeFunction: RouteFunction, path: string,) {
    const requestHandler = jest.fn();
    const router = { post: jest.fn(), delete: jest.fn(), get: jest.fn(), put: jest.fn(), } as unknown as express.Router;
    routeFunction(router, path, requestHandler);
    return {router, requestHandler};
}

function entityRouteTestHelper(routeFunction: EntityRouteFunction, path: string,) {
    const requestHandler = jest.fn();
    const router = { post: jest.fn(), delete: jest.fn(), get: jest.fn(), put: jest.fn(), } as unknown as express.Router;
    routeFunction("id", router, path, requestHandler);
    return {router, requestHandler};
}
