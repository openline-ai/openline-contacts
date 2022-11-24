import {CustomField, FieldSet} from "./customFields";

export type Contact = {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    owner: Owner;
    contactType: ContactType;
    notes: string;
    label: string;

    customFields: CustomField[];
    fieldSets: FieldSet[];
}

export type Owner = {
    id: string;
    firstName: string;
    lastName: string;
}

export type ContactType = {
    id: string;
    name: string;
}