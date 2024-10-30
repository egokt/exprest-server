export class Endpoint {
    routerMountRelativePath: string;

    constructor({ routerMountRelativePath, } : { routerMountRelativePath: string, }) {
        this.routerMountRelativePath = routerMountRelativePath;
    }
}
