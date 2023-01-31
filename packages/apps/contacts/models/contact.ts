import {EntityDefinition, EntityExtension} from "./customFields";

type ContactDataSource = "NA" | "OPENLINE" | "HUBSPOT" | "ZENDESK";

export type Contact = {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    owner: Owner;
    contactType: ContactType;
    notes: string;
    label: string;
    definition: EntityDefinition;
    source: ContactDataSource;
} & EntityExtension

export type Owner = {
    id: string;
    firstName: string;
    lastName: string;
}

export type ContactType = {
    id: string;
    name: string;
}

export type Note = {
    id: string;
    html: any;
}