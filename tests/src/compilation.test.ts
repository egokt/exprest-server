import { resolve } from 'path';
import { execSync, SpawnSyncReturns } from 'child_process';

describe("Testing compilation of test ts files", () => {
    it("should compile all test ts files without errors or with expected errors", () => {
        let err: SpawnSyncReturns<Buffer> | null = null;
        try {
            execSync('npx tsc -p tsconfig.compile-tests.json', { cwd: resolve(__dirname, '../..') });
        } catch (error) {
            err = error as unknown as SpawnSyncReturns<Buffer>;
        }
        if (err) {
            // fail does not work in try/catch blocks, so we process it outside try/catch
            throw new Error(err.stdout.toString());
        }
    });
});