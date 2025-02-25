import { jest } from '@jest/globals';

import { AbstractLogging } from '@interfaces/logging';

export const LoggingMock: AbstractLogging = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn()
}