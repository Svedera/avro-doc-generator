import { AvroSchema, AvroSchemaView } from '@models/avro';

export abstract class AbstractAvroParser {
    abstract parse(content: string): AvroSchema;
    abstract convertToView(schema: AvroSchema): AvroSchemaView;
}