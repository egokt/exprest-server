export class Endpoint {
    routerMountRelativePath: string;

    constructor({ routerMountRelativePath, } : { routerMountRelativePath: string, }) {
        this.routerMountRelativePath =
            routerMountRelativePath === "" || routerMountRelativePath[0] === "/"
                ? routerMountRelativePath
                : `/${routerMountRelativePath}`;
    }
}
