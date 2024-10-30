import { SuccessfulCollectionResponse } from '@egokt/exprest-shared';
import { Endpoint } from './endpoint.js';
import { RequestHandler } from './request-handler.js';

export interface AddGetCollectionToRouter<RESULT extends Object | null, PARAMS extends {[key: string]: true} | null = null> {
    (router: import('express').Router, requestHandler: RequestHandler<RESULT extends null ? null : SuccessfulCollectionResponse<RESULT>, PARAMS>): void;
}

export class GetCollectionEndpoint<ResponseBodyType extends Object> extends Endpoint {
    // constructor(param: ConstructorParameters<typeof Endpoint>[0]) {
    //     super(param);
    // }

    addToRouter: AddGetCollectionToRouter<ResponseBodyType> = (router, requestHandler) => {
        const routerMountRelativePath =
            this.routerMountRelativePath[0] === "/"
                ? this.routerMountRelativePath
                : `/${this.routerMountRelativePath}`;
        router.get(routerMountRelativePath, requestHandler);
    }
}
