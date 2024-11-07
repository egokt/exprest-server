export { getCollectionWithAuth, getCollectionWoAuth } from './request-handler-factories/get-collection.js';
export { createWithAuth, createWoAuth } from './request-handler-factories/create.js';
export { getSingletonWithAuth, getSingletonWoAuth } from './request-handler-factories/get-singleton.js';
export { updateSingletonWithAuth, updateSingletonWoAuth } from './request-handler-factories/update-singleton.js';
export { deleteSingletonWithAuth, deleteSingletonWoAuth } from './request-handler-factories/delete-singleton.js';
export { getEntityWithAuth, getEntityWoAuth } from './request-handler-factories/get-entity.js';
export { updateEntityWithAuth, updateEntityWoAuth } from './request-handler-factories/update-entity.js';
export { deleteEntityWithAuth, deleteEntityWoAuth } from './request-handler-factories/delete-entity.js';
export { actionWithAuth, actionWoAuth } from './request-handler-factories/action.js';

export {
    addActionRoute,
    addCreateRoute,
    addDeleteEntityRoute,
    addDeleteSingletonRoute,
    addGetCollectionRoute,
    addGetEntityRoute,
    addGetSingletonRoute,
    addUpdateEntityRoute,
    addUpdateSingletonRoute,
} from './router-helpers.js';