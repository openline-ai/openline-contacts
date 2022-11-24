export type CustomField = {
    id: string;
    name: string;
    datatype: string;
    value: string;
    definitionId: string;
}

export type CustomFieldDefinition = {
    id: string;
    name: string;
    type: string;
    order: string;
    mandatory: string;
    length: string;
    min: string;
    max: string;
}

export type FieldSetDefinition = {
    id: string;
    name: string;
    order: number;
    customFields: CustomFieldDefinition[];
}

export type EntityDefinition = {
    id: string;
    name: string;
    fields: (CustomFieldDefinition | FieldSetDefinition)[];
}