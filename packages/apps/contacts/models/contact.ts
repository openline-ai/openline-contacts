import {EntityDefinition, EntityExtension} from "./customFields";
import {Organization} from "./organization";

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
    source: ContactDataSource;
    tags: Array<ContactTag>
    jobRoles: Array<ContactJobRole>
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

export type ContactJobRole = {
    id: string;
    jobTitle: string;
    organization: Organization;
}

export type Note = {
    id: string;
    html: any;
}