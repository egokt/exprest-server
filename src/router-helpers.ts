import {
    ActionRequestHandlerFunction,
    EntityReturningRequestHandlerFunction,
    GetCollectionRequestHandlerFunction
} from 'exprest-shared';

/**
 * Function to use for adding an action handler to an express router.
 * 
 * @param router An express router.
 * @param path Path to mount the handler on.
 * @param requestHandler Request handler for the endpoint.
 */
export function addActionRoute<QUERY_PARAMS, RESPONSE_BODY>(
    router: import('express').Router,
    path: string,
    requestHandler: ActionRequestHandlerFunction<RESPONSE_BODY, QUERY_PARAMS>,
): void {
    router.post(path, requestHandler);
}

/**
 * Function to use for adding a create handler to an express router.
 * 
 * @param router An express router.
 * @param path Path to mount the handler on.
 * @param requestHandler Request handler for the endpoint.
 */
export function addCreateRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    router: import('express').Router,
    path: string,
    requestHandler: EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.post(path, requestHandler);
}

/**
 * Function to use for adding a delete entity handler to an express router.
 * 
 * @param router An express router.
 * @param path Path to mount the handler on.
 * @param requestHandler Request handler for the endpoint.
 */
export function addDeleteEntityRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    idParamName: string,
    router: import('express').Router,
    path: string,
    requestHandler: EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.delete(mergePathWithIdParamIfNeeded(path, idParamName), requestHandler);
}

export function addDeleteSingletonRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    router: import('express').Router,
    path: string,
    requestHandler: EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.delete(path, requestHandler);
}

/**
 * Function to use for adding a get collection handler to an express router.
 * 
 * @param router An express router.
 * @param path Path to mount the handler on.
 * @param requestHandler Request handler for the endpoint.
 */
export function addGetCollectionRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    router: import('express').Router,
    path: string,
    requestHandler: GetCollectionRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.get(path, requestHandler);
}

/**
 * Function to use for adding a get entity handler to an express router.
 * 
 * @param router An express router.
 * @param path Path to mount the handler on.
 * @param requestHandler Request handler for the endpoint.
 */
export function addGetEntityRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    idParamName: string,
    router: import('express').Router,
    path: string,
    requestHandler: EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.get(mergePathWithIdParamIfNeeded(path, idParamName), requestHandler);
}

/**
 * Function to use for adding a get singleton handler to an express router.
 * 
 * @param router An express router.
 * @param path Path to mount the handler on.
 * @param requestHandler Request handler for the endpoint.
 */
export function addGetSingletonRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    router: import('express').Router,
    path: string,
    requestHandler: EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.get(path, requestHandler);
}

/**
 * Function to use for adding a update entity handler to an express router.
 * 
 * @param router An express router.
 * @param path Path to mount the handler on.
 * @param requestHandler Request handler for the endpoint.
 */
export function addUpdateEntityRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    idParamName: string,
    router: import('express').Router,
    path: string,
    requestHandler: EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.put(mergePathWithIdParamIfNeeded(path, idParamName), requestHandler);
}

export function addUpdateSingletonRoute<
    ENTITY extends Object,
    FRONT_END_ENTITY extends Object,
    SANITIZED_PARAMS extends {[key: string]: string},
    OTHER_DATA extends Object | null = null,
>(
    router: import('express').Router,
    path: string,
    requestHandler: EntityReturningRequestHandlerFunction<ENTITY, FRONT_END_ENTITY, SANITIZED_PARAMS, OTHER_DATA>,
): void {
    router.put(path, requestHandler);
}

function mergePathWithIdParamIfNeeded(path: string, idParamName: string): string {
    const pathIdParam = `:${idParamName}`;
    if (path.includes(pathIdParam)) {
        return path;
    } else {
        if (path.endsWith('/')) {
            return `${path}${pathIdParam}`;
        } else {
            return `${path}/${pathIdParam}`;
        }
    }
}

