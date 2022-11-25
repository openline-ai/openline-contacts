import {gql, GraphQLClient} from "graphql-request";
import {Contact} from "../models/contact";
import {CustomField, FieldSet} from "../models/customFields";
import {string} from "prop-types";

export function GetContactDetails(client: GraphQLClient, id: string): Promise<Contact> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactDetails($id: ID!) {
            contact(id: $id) {
                id
                title
                firstName
                lastName
                owner{
                    id
                    firstName
                    lastName
                }
                contactType{
                    id
                    name
                }
                label
                notes
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.contact) {
                resolve(response.contact);
            } else {
                reject(response.error);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}

export function GetContactCustomFields(client: GraphQLClient, id: string): Promise<(CustomField | FieldSet)[]> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactCustomFields($id: ID!) {
            contact(id: $id) {
                customFields {
                    id
                    name
                    datatype
                    value
                    definition {
                        id
                        name
                        type
                        order
                        mandatory
                        length
                        min
                        max
                    }
                }
                fieldSets {
                    id
                    name
                    definition {
                        id
                        name
                        order
                    }
                    customFields {
                        id
                        name
                        datatype
                        value
                        definition {
                            id
                            name
                            type
                            order
                            mandatory
                            length
                            min
                            max
                        }
                    }
                }
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.contact) {
                var sortedData = [] as any;
                response.contact.customFields.forEach((f: any) => sortedData.push(f));
                response.contact.fieldSets.forEach((f: any) => {
                    f.customFields = f.customFields.sort(function (a: any, b: any) {
                        return a.definition.order - b.definition.order;
                    });
                    sortedData.push(f);
                });

                sortedData = sortedData.sort(function (a: any, b: any) {
                    return a.definition.order - b.definition.order;
                });

                resolve(sortedData);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}

export function CreateContact(client: GraphQLClient, data: any): Promise<Contact> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation CreateContact($contact: ContactInput!) {
            contact_Create(input: $contact) {
                id
            }
        }`

        client.request(query, {
                contact: {
                    title: data.title,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    contactTypeId: data.contactTypeId,
                    ownerId: data.ownerId,
                    label: data.label,
                    notes: data.notes,
                    definitionId: data.definitionId,
                    customFields: data.customFields,
                    fieldSets: data.fieldSets,
                }
            }
        ).then((response: any) => {
            if (response.contact_Create) {
                resolve(response.contact_Create);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function UpdateContact(client: GraphQLClient, data: any): Promise<Contact> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation CreateContact($contact: ContactUpdateInput!) {
            contact_Update(input: $contact) {
                id
            }
        }`

        client.request(query, {
                contact: {
                    id: data.id,
                    title: data.title,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    contactTypeId: data.contactTypeId,
                    ownerId: data.ownerId,
                    label: data.label,
                    notes: data.notes,
                }
            }
        ).then((response: any) => {
            if (response.contact_Update) {
                resolve(response.contact_Update);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function DeleteContact(client: GraphQLClient, id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation DeleteContact($contactId: ID!) {
            contact_SoftDelete(contactId: $contactId) {
                result
            }
        }`

        client.request(query, {contactId: id}).then((response: any) => {
            if (response.contact_SoftDelete.result) {
                resolve(true);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}