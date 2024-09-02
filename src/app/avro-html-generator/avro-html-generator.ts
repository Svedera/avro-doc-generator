import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';

import { AbstractHtmlGenerator } from '@interfaces/html-generator';
import { AvroSchemaView } from '@models/avro';


export class AvroHtmlGeneratorService
    implements AbstractHtmlGenerator<AvroSchemaView> {

    readonly templatePath = './avro-doc.mustache';
    private template: string;

    constructor() {
        this.template = readFileSync(
            resolve(__dirname, this.templatePath), 'utf-8');
    }

    generate(schemas: AvroSchemaView[]): string {
        const schemasWithIndex = schemas.map((schema, index) => ({
            ...schema,
            index: index
        }));
    return Mustache.render(this.template, {
            schemas: schemasWithIndex,
            schemasString: JSON.stringify(schemasWithIndex)
        });
    }
}
