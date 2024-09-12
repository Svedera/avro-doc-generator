const Selectors = Object.freeze({
    Content: Symbol('schema-content'),
    SchemaData: Symbol('schemas-data'),
    SchemaLink: Symbol('schema-link'),
    DataIndex: Symbol('data-index'),
});

const Styles = Object.freeze({
    FieldCell: Symbol('p-4 border-b border-blue-gray-50 whitespace-normal'),
    SchemaData: Symbol('schemas-data'),
    TableHeader: Symbol('p-4 border-b border-blue-gray-100 bg-blue-gray-5'),
});

const AvroTypes = Object.freeze({
    Array: Symbol('array'),
    Enum: Symbol('enum'),
    Record: Symbol('record'),
});

function toggleCollapse(button) {
    const childNodes = button.nextElementSibling;
    if (childNodes) {
        childNodes.classList.toggle(Styles.Hidden);
    }
}

function getFieldRaw(name, type, doc) {
    return `<tr>
                <td class='${fieldCellStyle}'>${name}</td>
                <td class='${fieldCellStyle}'>${type}</td>
                <td class='${fieldCellStyle}'>${doc}}</td>
            </tr>`;
}

function getEnumString(enumValues) {
    return enumValues.map(item => `'${item}'`).join(', ');
}

function getArrayType(field) {
    var arrayLevel = '[]';
    function getType(innerField) {
        if (innerField?.type == AvroTypes.Array) {
            arrayLevel = `${arrayLevel}[]`;
            return getType(innerField.items);
        }
        return `${innerField?.name || innerField?.type || innerField}${arrayLevel}`;
    }
    return getType(field.type.items);
}

function getNullableEnumTemplate(field) {
    const fieldName = field.type[1].name;
    const enumSymbols = getEnumString(field.type[1].symbols);
    const type = `'null', ${enumSymbols}`;
    const doc = field.doc || '';
    return getFieldRaw(fieldName, type, doc);
}

function getEnumTemplate(field) {
    const fieldName = field.name;
    const type = getEnumString(field.type[1].symbols);
    const doc = field.doc || '';
    return getFieldRaw(fieldName, type, doc);
}

function getNullableRecordTemplate(field) {
    const name = field.type[1].name;
    const recordName = field.type[1].name;
    const type = `null, ${recordName}`;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getRecordTemplate(field) {
    const name = field.name;
    const type = field.type.name || field.type;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getNullableArrayTemplate(field) {
    const arrayType = getArrayType(field.type[1])
    const name = field.type[1].name;
    const type = `null, ${arrayType}`;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getArrayTemplate(field) {
    const type = getArrayType(field)
    const name = field.name;
    const doc = field.doc || '';
    return getFieldRaw(name, type, doc);
}

function getFieldTemplate(field) {
    if (Array.isArray(field.type) && field.type[1]?.type === AvroTypes.Enum) {
        return getNullableEnumTemplate(field);
    }
    if (Array.isArray(field.type) && field.type[1]?.type === AvroTypes.Record) {
        return getNullableRecordTemplate(field);
    }
    if (Array.isArray(field.type) && field.type[1]?.type === AvroTypes.Array) {
        return getNullableArrayTemplate(field);
    }
    if (field.type?.type === AvroTypes.Enum) {
        return getEnumTemplate(field);
    }
    if (field.type?.type === AvroTypes.Array) {
        return getArrayTemplate(field);
    }
    return getRecordTemplate(field);
}

function getDescriptionContent(fieldDescription) {
    if (fieldDescription.type === 'record') {
        const descriptionContent = getFieldsTable(fieldDescription.fields);
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
                        ${descriptionContent}
                    </tbody>
                </table>
            </div>`;
    }
    return '';
}

function getContent(fieldsHtml, dictionariesHtml) {
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
    ${dictionariesHtml}
    `;
}

function showSchema(index) {
    const schemaContent =
        document.getElementById(Selectors.SchemaData).innerHTML;
    const schemas = JSON.parse(schemaContent);
    const schema = schemas[index].item;
    if (schema == null) {
        return;
    }

    const content = document.getElementById(Selectors.Content);
    let fieldsHtml = fields.map(field => getFieldTemplate(field)).join('');;
    let dictionariesHtml = '';
    schema.fieldDescriptions.map(fieldDescription =>
        getDescriptionContent(fieldDescription)).join('');
    content.innerHTML = getContent(fieldsHtml, dictionariesHtml);
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
        });
    });
});
