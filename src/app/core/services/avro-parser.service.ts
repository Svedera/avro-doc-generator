import 'reflect-metadata';
import { singleton } from 'tsyringe';
import * as avro from 'avsc';

import { AbstractAvroParser } from '@interfaces/avro-parser';
import { AvroSchema } from '@models/avro';
import { AbstractLogging } from '@interfaces/logging';


@singleton()
export class AvroParser implements AbstractAvroParser {

    constructor(private logging: AbstractLogging) {

    }

    parse(content: string): AvroSchema {
        const jsonSchema = avro.Type.forSchema(JSON.parse(content)).toJSON();
        const avroSchema = jsonSchema as AvroSchema;

        if (avroSchema.fields) {
        }
        return avroSchema;
    }
}