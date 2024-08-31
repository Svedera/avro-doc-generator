import { dictionary } from '@shared/types/general';

export class AvroField {
    name: string;
    type: AvroType;
    doc: string | null;
    fields: AvroField[] | null;
    customFields: dictionary<string> | null;

    constructor(
        name: string,
        type: AvroType,
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

    constructor(
        name: string,
        type: AvroType,
        namespace: string,
        doc: string | null,
        fields: AvroField[] | null,
        customFields: dictionary<string> | null) {

        super(name, type, doc, fields, customFields);
        this.namespace = namespace;
    }
}

export interface AvroType {
    type: string;
    name: string | null;
    doc: string | null;
    symbols: string[] | null;
}