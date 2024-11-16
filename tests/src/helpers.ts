
export function mockExpressResponse() {
    const jsonFn = jest.fn();
    const endFn = jest.fn();
    const sendFn = jest.fn();
    const status = jest.fn().mockReturnValue({json: jsonFn, end: endFn, send: sendFn});
    return {response: {status}, status, jsonFn, endFn, sendFn};
}