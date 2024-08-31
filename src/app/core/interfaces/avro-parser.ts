import { AvroSchema } from '@models/avro';

export abstract class AbstractAvroParser {
    abstract parse(content: string): AvroSchema;
}