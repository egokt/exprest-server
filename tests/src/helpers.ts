
export function mockExpressResponse() {
    return {status: jest.fn().mockReturnValue({end: jest.fn()})};
}