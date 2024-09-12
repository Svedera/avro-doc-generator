import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';

import { AbstractHtmlGenerator } from '@interfaces/html-generator';
import { AvroSchemaView, AvroViewWithIndex } from '@models/avro';
import { ItemWithIndex, ViewGroup } from '@models/mustache';


export class AvroHtmlGeneratorService
    implements AbstractHtmlGenerator<AvroSchemaView> {

    readonly templatePath = './avro-doc.mustache';
    readonly stylesPath = './styles.css';
    readonly scriptPath = './avro-doc.js';
    private template: string;
    private script: string;
    private styles: string;

    constructor() {
        this.template = readFileSync(
            resolve(__dirname, this.templatePath), 'utf-8');
        this.styles = readFileSync(
            resolve(__dirname, this.stylesPath), 'utf-8');
        this.script = readFileSync(
            resolve(__dirname, this.scriptPath), 'utf-8');
    }


    generate(schemas: AvroSchemaView[], groupBy: string): string {
        const schemasWithIndex = this.getIndexedSchemas(schemas);
        const groupedSchemas = this.groupSchemas(schemasWithIndex, groupBy);
        return Mustache.render(this.template, {
            styles: this.styles,
            script: this.script,
            groupedSchemas: groupedSchemas,
            schemasString: JSON.stringify(schemasWithIndex)
        });
    }

    getIndexedSchemas =
        (schemas: AvroSchemaView[]): AvroViewWithIndex[] =>
            schemas.map((schema, index) => (new ItemWithIndex(index, schema)));

    groupSchemas(
        schemaEntries: AvroViewWithIndex[],
        groupField: string): ViewGroup<AvroViewWithIndex>[] {

        const groupedSchemas: { [key: string]: AvroViewWithIndex[] }
            = schemaEntries.reduce((acc, schemaEntry: AvroViewWithIndex) => {
                const key = groupField as keyof AvroSchemaView;
                const groupFieldValue = schemaEntry.item[key];
                if (!acc[groupFieldValue]) {
                    acc[groupFieldValue] = [] as AvroViewWithIndex[];
                }
                acc[groupFieldValue].push(schemaEntry);
                return acc;
            }, {} as { [key: string]: AvroViewWithIndex[] });

        const groupsForMustache = Object.keys(groupedSchemas)
            .map(groupName => ({
                groupName,
                schemas: groupedSchemas[groupName]
            }));

        return groupsForMustache;
    }
}
