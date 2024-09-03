import { dictionary } from '@shared/types/general';
import { ItemWithIndex } from './mustache';

export enum AvroFieldType {
    Null = 'null',
    Boolean = 'boolean',
    Int = 'int',
    Long = 'long',
    Float = 'float',
    Double = 'double',
    Bytes = 'bytes',
    String = 'string',
    Record = 'record',
    Enum = 'enum',
    Array = 'array',
    Map = 'map',
    Union = 'union',
    Fixed = 'fixed',
}

export type AvroSchemaType =
    AvroType | AvroFieldType | (AvroType | AvroFieldType)[];

export class AvroField {
    name: string;
    type: AvroSchemaType;
    doc: string | null;
    fields: AvroField[] | null;
    customFields: dictionary<string> | null;

    constructor(
        name: string,
        type: AvroSchemaType,
        doc: string | null,
        fields: AvroField[] | null,
        customFields: dictionary<string> | null) {

        this.name = name;
        this.type = type;
        this.doc = doc;
        this.fields = fields;
        this.customFields = customFields;
    }
}

export class AvroSchema extends AvroField {
    namespace: string;
    // TODO: add parsing of all custom fields in a generic way
    version: string | null;

    constructor(
        name: string,
        type: AvroSchemaType,
        namespace: string,
        version: string | null,
        doc: string | null,
        fields: AvroField[] | null,
        customFields: dictionary<string> | null) {

        super(name, type, doc, fields, customFields);
        this.namespace = namespace;
        this.version = version;
    }
}

export class AvroType {
    type: AvroSchemaType;
    name: string | null;
    doc: string | null;
    symbols: string[] | null;
    fields: AvroField[] | null;
    items: AvroSchemaType | null;

    constructor(
        type: AvroSchemaType,
        name: string | null,
        doc: string | null,
        symbols: string[] | null,
        fields: AvroField[] | null,
        items: AvroSchemaType | null) {

        this.type = type;
        this.name = name;
        this.doc = doc;
        this.symbols = symbols;
        this.fields = fields;
        this.items = items;
    }
}

export class AvroSchemaView extends AvroSchema {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    schemaName: string;
    fieldDescriptions: (AvroField | AvroType)[];

    constructor(
        schema: AvroSchema,
        fieldDescriptions: (AvroField | AvroType)[]) {

        super(
            schema.name,
            schema.type,
            schema.namespace,
            schema.version,
            schema.doc,
            schema.fields,
            schema.customFields);
        this.schemaName = this.removeAvroNamespace(schema.name);
        this.fieldDescriptions = fieldDescriptions;
    }

    private removeAvroNamespace(schemaName: string): string {
        if (!schemaName.includes('.')) {
            return schemaName;
        }

        const name = schemaName.split('.').pop();
        if (name == null) {
            throw new Error(`Could not get schema name from "${schemaName}"`);
        }
        return name;
    }
}

export type AvroViewWithIndex = ItemWithIndex<AvroSchemaView>;

export const isSimpleField = (
    type: AvroSchemaType) =>
    type === AvroFieldType.Boolean ||
    type === AvroFieldType.Bytes ||
    type === AvroFieldType.Double ||
    type === AvroFieldType.Float ||
    type === AvroFieldType.Fixed ||
    type === AvroFieldType.Int ||
    type === AvroFieldType.Long ||
    type === AvroFieldType.Null ||
    type === AvroFieldType.String ||
    type === AvroFieldType.Union;