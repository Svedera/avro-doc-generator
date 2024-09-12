import { AvroField, AvroFieldType, AvroSchemaView, AvroType } from "@models/avro";

const FieldNameNotSpecified = 'Name not specified';

enum Selectors {
    Content = 'schema-content',
    SchemaData = 'schemas-data',
    SchemaLink = 'schema-link',
    DataIndex = 'data-index',
};

enum Styles {
    FieldCell = 'p-4 border-b border-blue-gray-50 whitespace-normal',
    SchemaData = 'schemas-data',
    TableHeader = 'p-4 border-b border-blue-gray-100 bg-blue-gray-5',
    Hidden = 'hidden'
};

function toggleCollapse(button: HTMLButtonElement) {
    const childNodes = button.nextElementSibling;
    if (childNodes) {
        childNodes.classList.toggle(Styles.Hidden);
    }
}

function getFieldRaw(name: string, type: string, doc: string) {
    return `<tr>
                <td class='${Styles.FieldCell}'>${name}</td>
                <td class='${Styles.FieldCell}'>${type}</td>
                <td class='${Styles.FieldCell}'>${doc}}</td>
            </tr>`;
}

function getEnumString(enumValues: string[] | null): string {
    if (enumValues == null) {
        return '';
    }
    return enumValues.map(item => `'${item}'`).join(', ');
}

function getArrayType(field: AvroType, fieldName: string) {
    var arrayLevel = '[]';
    function getType(innerField: AvroType) {
        if (innerField.type === AvroFieldType.Array) {
            arrayLevel = `${arrayLevel}[]`;
            if (innerField.items == null) {
                throw new Error(`Could not parse nested array type for field '${fieldName}'.`);
            }
            const innerArrayType = innerField.items as AvroType;
            return getType(innerArrayType);
        }
        return `${innerField?.name || innerField?.type || innerField}${arrayLevel}`;
    }
    if (field.items == null) {
        throw new Error(`Could not parse nested array type for field '${fieldName}'.`);
    }
    const arrayType = field.items as AvroType
    return getType(arrayType);
}

function getNullableEnumTemplate(field: AvroField) {
    const enumType = field.type as AvroType;
    const fieldName = enumType.name ?? FieldNameNotSpecified;
    const enumSymbols = getEnumString(enumType.symbols);
    const type = `'null', ${enumSymbols}`;
    const doc = field.doc || '';
    return getFieldRaw(fieldName, type, doc);
}

function getEnumTemplate(field: AvroField) {
    const fieldName = field.name;
    const fieldType = field.type as AvroType[];
    const type = getEnumString(fieldType[1].symbols);
    const doc = field.doc || '';
    return getFieldRaw(fieldName, type, doc);
}

function getNullableRecordTemplate(field: AvroField) {
    const fieldType = field.type as AvroType[];
    const name = fieldType[1].name ?? FieldNameNotSpecified;
    const recordName = fieldType[1].name;
    const type = `null, ${recordName}`;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getRecordTemplate(field: AvroField) {
    const recordType = field.type as (AvroType | string);
    const name = field.name || FieldNameNotSpecified;
    const type = (recordType as AvroType).name || recordType as string;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getNullableArrayTemplate(field: AvroField) {
    const arrayeType = (field.type as AvroType[])[1];
    const name = arrayeType.name ?? FieldNameNotSpecified;
    const arrayType = getArrayType(arrayeType, name);
    const type = `null, ${arrayType}`;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getArrayTemplate(field: AvroField) {
    const type = getArrayType(field.type as AvroType, field.name);
    const name = field.name;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getNullableFieldTemplate(field: AvroField) {
    const type = (field.type as AvroType[])[0]?.type;
    if (type === AvroFieldType.Enum) {
        return getNullableEnumTemplate(field);
    }
    if (type === AvroFieldType.Record) {
        return getNullableRecordTemplate(field);
    }
    if (type === AvroFieldType.Array) {
        return getNullableArrayTemplate(field);
    }
    throw Error('Unknonwn nullable field type');
}

function getFieldTemplate(field: AvroField) {
    if (Array.isArray(field.type)) {
        return getNullableFieldTemplate(field);
    }

    const fieldType = field.type as AvroType;
    if (fieldType.type === AvroFieldType.Enum) {
        return getEnumTemplate(field);
    }
    if (fieldType.type === AvroFieldType.Array) {
        return getArrayTemplate(field);
    }
    return getRecordTemplate(field);
}

function getDescriptionContent(fieldDescription: AvroField) {
    if (fieldDescription.type === 'record' && fieldDescription.fields) {
        const content = fieldDescription.fields
            .map(field => getFieldTemplate(field)).join('');
        return `
            <h3 class='block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-inherit pt-4 pb-2'>
                ${fieldDescription.name}
            </h3>
            <div class='relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
                <table class='tw-full text-left table-auto'>
                    <thead>
                        <tr>
                            <th class='${Styles.TableHeader}'>Name</th>
                            <th class='${Styles.TableHeader}'>Type</th>
                            <th class='${Styles.TableHeader}'>Description</th>
                        </tr>
                    </thead>
                    <tbody class='bg-white divide-y divide-gray-200'>   
                        ${content}
                    </tbody>
                </table>
            </div>`;
    }
    return '';
}

function getContent(
    schema: AvroSchemaView,
    fieldsHtml: string,
    dictionariesHtml: string): string {
    return `
    <h2 class='block font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-inherit'>
        ${schema.name} v.${schema.version}
    </h2>
    <div class='relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
        <table class='tw-full text-left table-auto'>
            <thead>
                <tr>
                    <th class='${Styles.TableHeader}'>Name</th>
                    <th class='${Styles.TableHeader}'>Type</th>
                    <th class='${Styles.TableHeader}'>Description</th>
                </tr>
            </thead>
            <tbody class='bg-white divide-y divide-gray-200'>   
                ${fieldsHtml}
            </tbody>
        </table>
    </div>
    ${dictionariesHtml}`;
}

function showSchema(index: number) {
    if (document == null) {
        throw new Error('Docuemnt is is not defiend.');
    }
    const schemaContent =
        document.getElementById(Selectors.SchemaData)?.innerHTML;
    if (schemaContent == null) {
        resetContent();
        return;
    }

    const schemas = JSON.parse(schemaContent);
    const schema = schemas[index].item as AvroSchemaView;
    if (schema?.fields == null) {
        resetContent();
        return;
    }

    const content = document.getElementById(Selectors.Content);
    if (content == null) {
        console.error('Could not find content by element id.')
        return;
    }

    let fieldsHtml =
        schema.fields.map(field => getFieldTemplate(field)).join('');
    let dictionariesHtml = '';
    const descriptions = schema.fieldDescriptions as AvroField[];
    descriptions.map(fieldDescription =>
        getDescriptionContent(fieldDescription)).join('');
    content.innerHTML = getContent(schema, fieldsHtml, dictionariesHtml);
}

function resetContent() {
    const content = document.getElementById(Selectors.Content);
    if (content == null) {
        console.error('Could not find content by element id.')
        return;
    }
    content.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const schemaLinks = document.querySelectorAll(`.${Selectors.SchemaLink}}`);
    schemaLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const indexAtribute = link.getAttribute(Selectors.DataIndex) || '-1';
            const index = parseInt(indexAtribute, 10);
            if (index >= 0) {
                showSchema(index);
            }
            throw new Error('Index of schema is not set for the link.');
        });
    });
});
