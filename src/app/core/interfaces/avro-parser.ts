import { AvroSchema, AvroSchemaView } from '@models/avro';

export abstract class AbstractAvroParser {
    abstract parse(content: string): AvroSchema | null;
    abstract convertToView(schema: AvroSchema): AvroSchemaView;
}