import 'reflect-metadata';
import { singleton } from 'tsyringe';
import * as avro from 'avsc';

import { AbstractAvroParser } from '@interfaces/avro-parser';
import { AvroField, AvroFieldType, AvroSchema, AvroSchemaView, AvroType, isSimpleField } from '@models/avro';
import { AbstractLogging } from '@interfaces/logging';


@singleton()
export class AvroParser implements AbstractAvroParser {

    constructor(private logging: AbstractLogging) { }

    parse(content: string): AvroSchema {
        this.logging.debug('Starting parsing of schema')
        const avroSchema: AvroSchema =
            JSON.parse(content) as AvroSchema;
        this.logging.debug('Parsing of schema is finished');
        return avroSchema;
    }

    convertToView(schema: AvroSchema): AvroSchemaView {
        this.logging.debug('Starting parsing of schema fields recursively')
        const descriptions = this.flattenFields(schema);
        const schemaView = new AvroSchemaView(schema, descriptions);
        this.logging.debug('Parsing of schema fields recursively is finished');
        return schemaView;
    }

    flattenFields(schema: AvroSchema): (AvroField | AvroType)[] {
        const flatFields: (AvroField | AvroType)[] = [];

        const parseFieldsRecursively = (currentFields: AvroField[] | null) => {
            if (currentFields == null) {
                return;
            }


            for (const field of currentFields) {
                if (isSimpleField(field.type)) {
                    continue;
                }



                if (field.type === AvroFieldType.Enum) {
                    const fieldAdded = flatFields.find(
                        searchField => searchField.name === avroType.name);
                    if (!fieldAdded) {
                        flatFields.push(field);
                    }
                }


                if (Array.isArray(field.type) &&
                    field.type[0] === 'null' &&
                    (field.type[1] as AvroType)?.type
                    === AvroFieldType.Record) {

                    const nullableRecord = field.type[1] as AvroType;
                    const fieldAdded = flatFields.find(searchField =>
                        searchField.name === nullableRecord.name);
                    if (!fieldAdded && nullableRecord.fields) {
                        flatFields.push(nullableRecord);
                        parseFieldsRecursively(nullableRecord.fields);
                    }
                }

                if (Array.isArray(field.type) &&
                    field.type[0] === 'null' &&
                    (field.type[1] as AvroType)?.type
                    === AvroFieldType.Enum) {

                    const nullableEnum = (field.type[1] as AvroType);
                    const fieldAdded = flatFields.find(
                        searchField => searchField.name === nullableEnum.name);
                    if (!fieldAdded) {
                        flatFields.push(nullableEnum);
                    }
                }

                const avroType = field.type as AvroType;

                if (avroType && avroType.type === AvroFieldType.Record) {

                    const fieldAdded = flatFields.find(
                        searchField => searchField.name === avroType.name);
                    if (!fieldAdded && avroType.fields) {
                        flatFields.push(avroType);
                        parseFieldsRecursively(avroType.fields);
                    }
                }

                const avroItems = avroType.items as AvroType;
                if (avroType && avroType.type === AvroFieldType.Array &&
                    avroItems?.type === AvroFieldType.Record) {
                    const fieldAdded = flatFields.find(
                        searchField => searchField.name === avroItems.name);
                    if (!fieldAdded && avroItems.fields) {
                        flatFields.push(avroItems);
                        parseFieldsRecursively(avroItems.fields);
                    }
                }
            }
        }
        parseFieldsRecursively(schema.fields);

        return flatFields;
    }

}