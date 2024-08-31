import { describe, expect, it, jest } from '@jest/globals';

describe('FileHandler', () => {

    it('should load file with content', () => {
        jest.mock('fs', () => ({
            doSomething: jest.fn()
        }))

        expect(1).toBeNull();
    });

});
