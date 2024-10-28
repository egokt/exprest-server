import { SuccessfulActionResponse, SuccessfulCollectionResponse, SuccessfulEntityResponse } from '@egokt/exprest-shared';

/**
 * 
 * @param params Request params obtained from req.params.
 * @param idParamName The name of the id parameter in the request.
 * @param treatIdAsString If true, the id will be returned as a string. Otherwise, it will be returned as a number.
 * @returns Id param value from the request.
 */
export function getId<ID>(
    params: { [key: string]: string },
    idParamName: string,
    treatIdAsString: boolean = false
): [null, ID] | [[string], null] {
    const idString = params[idParamName];

    if (treatIdAsString) {
        return [null, idString as unknown as ID];
    } else {
        const id = Number(params[idParamName]);
        if (Number.isNaN(id)) {
            return [[`id is not recognized.`], null];
        } else {
            return [null, id as unknown as ID];
        }
    }
}





export type RequestHandler<RESULT, PARAMS extends {[key: string]: true} | null = null> =
    PARAMS extends null
        ? (req: import('express').Request, res: import('express').Response<RESULT>) => Promise<void>
        : (req: import('express').Request<{[key in keyof PARAMS]: string}>, res: import('express').Response<RESULT>) => Promise<void>;



export interface AddActionToRouter<RESULT extends Object | null, PARAMS extends {[key: string]: true} | null = null> {
    (router: import('express').Router, requestHandler: RequestHandler<RESULT extends null ? null : SuccessfulActionResponse<RESULT>, PARAMS>): void;
}

export interface AddGetCollectionToRouter<RESULT extends Object | null, PARAMS extends {[key: string]: true} | null = null> {
    (router: import('express').Router, requestHandler: RequestHandler<RESULT extends null ? null : SuccessfulCollectionResponse<RESULT>, PARAMS>): void;
}

export interface AddGetSingletonToRouter<RESULT extends Object | null, PARAMS extends {[key: string]: true} | null = null> {
    (router: import('express').Router, requestHandler: RequestHandler<RESULT extends null ? null : SuccessfulEntityResponse<RESULT>, PARAMS>): void;
}

export class EndpointServer {
    routerMountRelativePath: string;

    constructor({
        routerMountRelativePath,
    } : {
        routerMountRelativePath: string,
    }) {
        this.routerMountRelativePath = routerMountRelativePath;
    }
}

export class GetCollectionEndpointServer<ResponseBodyType extends Object> extends EndpointServer {
    constructor(param: ConstructorParameters<typeof EndpointServer>[0]) {
        super(param);
    }

    addToRouter: AddGetCollectionToRouter<ResponseBodyType> = (router, requestHandler) => {
        const routerMountRelativePath =
            this.routerMountRelativePath[0] === "/"
                ? this.routerMountRelativePath
                : `/${this.routerMountRelativePath}`;
        router.get(routerMountRelativePath, requestHandler);
    }
}


export class GetSingletonEndpointServer<ResponseBodyType extends Object> extends EndpointServer {
    constructor(param: ConstructorParameters<typeof EndpointServer>[0]) {
        super(param);
    }

    addToRouter: AddGetSingletonToRouter<ResponseBodyType> = (router, requestHandler) => {
        const routerMountRelativePath =
            this.routerMountRelativePath === "" || this.routerMountRelativePath[0] === "/"
                ? this.routerMountRelativePath
                : `/${this.routerMountRelativePath}`;
        console.log("get singleton endpoint mount path: ", routerMountRelativePath);
        router.get(routerMountRelativePath, requestHandler);
    }
}



export class ActionEndpointServer<ResponseBodyType extends Object | null> extends EndpointServer {
    constructor(param: ConstructorParameters<typeof EndpointServer>[0]) {
        super(param);
    }

    addToRouter: AddActionToRouter<ResponseBodyType> = (router, requestHandler) => {
        router.post(this.routerMountRelativePath[0] === "/" ? this.routerMountRelativePath : `/${this.routerMountRelativePath}`, requestHandler);
    }
}


