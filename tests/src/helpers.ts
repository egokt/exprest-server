
export function mockExpressResponse() {
    return {status: jest.fn().mockReturnValue({json: jest.fn(), end: jest.fn()})};
}