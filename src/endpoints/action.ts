import { Endpoint } from "./endpoint.js";
import { ActionRequestHandlerFunction } from "../request-handler-factories/action.js";

type ActionEndpointConstructorProps<RESPONSE_BODY = {}, QUERY_PARAMS = {}> = 
    ConstructorParameters<typeof Endpoint>[0]
        & { requestHandler: ActionRequestHandlerFunction<RESPONSE_BODY, QUERY_PARAMS>};

export class ActionEndpoint<RESPONSE_BODY extends Object | null = null, QUERY_PARAMS = {}> extends Endpoint {
    private requestHandler: ActionRequestHandlerFunction<RESPONSE_BODY, QUERY_PARAMS>;

    constructor(param: ActionEndpointConstructorProps<RESPONSE_BODY, QUERY_PARAMS>) {
        super(param);
        this.requestHandler = param.requestHandler;
    }

    addToRouter(router: import('express').Router, routerMountRelativePath?: string): void {
        router.post(
            routerMountRelativePath || this.routerMountRelativePath,
            this.requestHandler
        );
    }
}
