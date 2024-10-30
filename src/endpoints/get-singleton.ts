import { SuccessfulEntityResponse } from "@egokt/exprest-shared";
import { Endpoint } from "./endpoint.js";
import { RequestHandler } from "./request-handler.js";

export interface AddGetSingletonToRouter<RESULT extends Object | null, PARAMS extends {[key: string]: true} | null = null> {
    (router: import('express').Router, requestHandler: RequestHandler<RESULT extends null ? null : SuccessfulEntityResponse<RESULT>, PARAMS>): void;
}

export class GetSingletonEndpoint<ResponseBodyType extends Object> extends Endpoint {
    // constructor(param: ConstructorParameters<typeof Endpoint>[0]) {
    //     super(param);
    // }

    addToRouter: AddGetSingletonToRouter<ResponseBodyType> = (router, requestHandler) => {
        const routerMountRelativePath =
            this.routerMountRelativePath === "" || this.routerMountRelativePath[0] === "/"
                ? this.routerMountRelativePath
                : `/${this.routerMountRelativePath}`;
        console.log("get singleton endpoint mount path: ", routerMountRelativePath);
        router.get(routerMountRelativePath, requestHandler);
    }
}
