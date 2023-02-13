import {EntityDefinition, EntityExtension} from "./customFields";

type ContactDataSource = "NA" | "OPENLINE" | "HUBSPOT" | "ZENDESK";

export interface ContactWebAction {
    id: string;
    startedAt: string;
    endedAt: string;
    pageTitle: string;
    pageUrl: string;
    application: string;
    sessionId: string;
    orderInSession: number;
    engagedTime: number;
}

export type Contact = {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    owner: Owner;
    notes: string;
    label: string;
    definition: EntityDefinition;
    source: ContactDataSource;
    tags: Array<{id:string, name:string}>
} & EntityExtension

export interface ContactWithActions {
    id: string;
    createdAt: string;
    actions: Array<ContactWebAction>
}

export type Owner = {
    id: string;
    firstName: string;
    lastName: string;
}

export type ContactTag = {
    id: string;
    name: string;
}

export type Note = {
    id: string;
    html: any;
}