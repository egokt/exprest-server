import { SuccessfulActionResponse } from "@egokt/exprest-shared";
import { Endpoint } from "./endpoint.js";
import { RequestHandler } from "./request-handler.js";

export interface AddActionToRouter<RESULT extends Object | null, PARAMS extends {[key: string]: true} | null = null> {
    (router: import('express').Router, requestHandler: RequestHandler<RESULT extends null ? null : SuccessfulActionResponse<RESULT>, PARAMS>): void;
}

export class ActionEndpoint<ResponseBodyType extends Object | null> extends Endpoint {
    // constructor(param: ConstructorParameters<typeof Endpoint>[0]) {
    //     super(param);
    // }

    addToRouter: AddActionToRouter<ResponseBodyType> = (router, requestHandler) => {
        router.post(this.routerMountRelativePath[0] === "/" ? this.routerMountRelativePath : `/${this.routerMountRelativePath}`, requestHandler);
    }
}
