export type RequestHandler<RESULT, PARAMS extends {[key: string]: true} | null = null> =
    PARAMS extends null
        ? (req: import('express').Request, res: import('express').Response<RESULT>) => Promise<void>
        : (req: import('express').Request<{[key in keyof PARAMS]: string}>, res: import('express').Response<RESULT>) => Promise<void>;
