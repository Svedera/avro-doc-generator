
import { readFileSync } from 'fs';

import { describe, expect, it } from '@jest/globals';

import { AvroParser } from '@services/avro-parser.service';
import { LoggingMock } from '@shared/mocks/services';
import { JsonParsingError } from '@shared/exceptions/file';

describe('AvroParser', () => {

    it.each([
        ['src/app/shared/mocks/schemas/events/InventoryRestocked.avro.json'],
        ['src/app/shared/mocks/schemas/events/LoginAttempted.avro.json']
    ])("when the input is '%s'", (schemaPath: string) => {
        const mockSchema = readFileSync(schemaPath, 'utf-8');
        const parser = new AvroParser(LoggingMock);
        const parsed = parser.parse(mockSchema);
        expect(parsed).toBeDefined();
    });

    it('Should raise an error', () => {
        const emptyFolderPath = 'src/app/shared/mocks/schemas/empty.avro.json';
        const mockSchema = readFileSync(emptyFolderPath, 'utf-8');
        const parser = new AvroParser(LoggingMock);
        const parsing = () => {
            parser.parse(mockSchema);
        };
        expect(parsing).toThrow(JsonParsingError);
    });

});
