import {gql, GraphQLClient} from "graphql-request";
import {Contact, Note} from "../models/contact";
import {PaginatedResponse, Pagination} from "../utils/pagination";

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
                template{
                    id
                }
                label
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

export function GetContactCustomFields(client: GraphQLClient, id: string): Promise<Contact> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactCustomFields($id: ID!) {
            contact(id: $id) {
                template {
                    id
                }
                customFields {
                    id
                    name
                    datatype
                    value
                    template {
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
                    template {
                        id
                        name
                        order
                    }
                    customFields {
                        id
                        name
                        datatype
                        value
                        template {
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

                resolve({
                    definition: response.contact.definition,
                    sortedFieldsAndFieldSets: sortedData,
                } as Contact);
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
                    ownerId: data.ownerId,
                    label: data.label,
                    notes: data.notes
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
            if (response.contact_SoftDelete) {
                resolve(response.contact_SoftDelete.result);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}



export function GetConversationsForContact(client: GraphQLClient, contactId: string, pagination: Pagination): Promise<PaginatedResponse<Note>> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetConversationsForContact($id: ID!, $pagination: Pagination!) {
            contact(id: $id) {
                id
                conversations(pagination: $pagination) {
                    content {
                        id
                        startedAt
                        updatedAt
                        status
                        channel
                        messageCount
                        source
                        initiatorFirstName
                        initiatorLastName

                    }
                }
            }
        }`

        client.request(query, {
            id: contactId,
            pagination: pagination
        }).then((response: any) => {
            console.log(response.contact.conversations)
            if (response.contact.conversations) {
                resolve({
                    content: response.contact?.conversations.content,
                    totalElements: response.contact?.conversations.totalElements
                });
            } else {
                reject(response.error);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}
export function GetContactNotes(client: GraphQLClient, contactId: string, pagination: Pagination): Promise<PaginatedResponse<Note>> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactNotes($contactId: ID!, $pagination: Pagination!) {
            contact(id: $contactId) {
                notes(pagination: $pagination) {
                    content {
                        id
                        html
                        createdAt
                        createdBy {
                            firstName
                            lastName
                        }
                        source
                    }
                    totalElements
                    
                }
            }
        }`

        client.request(query, {
            contactId: contactId,
            pagination: pagination
        }).then((response: any) => {
            console.log(response.contact.notes)
            if (response.contact.notes) {
                resolve({
                    content: response.contact.notes.content,
                    totalElements: response.contact.notes.totalElements
                });
            } else {
                reject(response.error);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}

export function CreateContactNote(client: GraphQLClient, contactId: string, data: any): Promise<Note> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation AddNote($contactId: ID!, $note: NoteInput!) {
            note_MergeToContact(contactId: $contactId, input: $note) {
                id
                html
            }
        }`

        client.request(query, {
                contactId: contactId,
                note: {
                    html: data.html
                }
            }
        ).then((response: any) => {
            if (response.note_MergeToContact) {
                resolve(response.note_MergeToContact);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function UpdateContactNote(client: GraphQLClient, contactId: string, data: any): Promise<Note> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation UpdateNote($contactId: ID!, $note: NoteUpdateInput!) {
            note_UpdateInContact(contactId: $contactId, input: $note) {
                id
                html
            }
        }`

        client.request(query, {
                contactId: contactId,
                note: {
                    id: data.id,
                    html: data.html
                }
            }
        ).then((response: any) => {
            if (response.note_UpdateInContact) {
                resolve(response.note_UpdateInContact);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function DeleteNote(client: GraphQLClient, contactId: any, noteId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation DeleteContact($contactId: ID!, $noteId: ID!) {
            note_DeleteFromContact(contactId: $contactId, noteId: $noteId) {
                result
            }
        }`

        client.request(query, {
            contactId: contactId,
            noteId: noteId
        }).then((response: any) => {
            if (response.note_DeleteFromContact) {
                resolve(response.note_DeleteFromContact.result);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}