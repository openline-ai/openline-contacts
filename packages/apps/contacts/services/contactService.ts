import {gql, GraphQLClient} from "graphql-request";
import {Contact, ContactWebAction, ContactWithActions, Note} from "../models/contact";
import {PaginatedResponse, Pagination} from "../utils/pagination";

export function GetContactDetails(client: GraphQLClient, id: string): Promise<Contact> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactDetails($id: ID!) {
            contact(id: $id) {
                id
                title
                firstName
                lastName
                tags {
                    id
                    name
                }
                owner{
                    id
                    firstName
                    lastName
                }
                tags {
                    id
                    name
                }
                
                template{
                    id
                }
                label
                source
            }
        }`

        client.request(query, {id}).then((response: any) => {
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

export function GetActionsForContact(client: GraphQLClient, id: string): Promise<ContactWithActions> {
    return new Promise((resolve, reject) => {
       const from =  new Date(1970, 0, 1).toISOString();
       const to = new Date().toISOString()
        const query = gql`query GetActionsForContact($id: ID!, $from: Time!, $to: Time! ) {
            contact(id: $id) {
                id
                firstName
                lastName
                createdAt
                actions(from:$from, to:$to) {
                    ... on PageViewAction {
                        id
                        application
                        startedAt
                        endedAt
                        engagedTime
                        pageUrl
                        pageTitle
                        orderInSession
                        sessionId
                    }
                }
            }
        }`

        client.request(query, {id, from, to}).then((response: any) => {
            if (response.contact) {
                resolve({...response.contact});
            } else {
                reject(response.error);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}
export function GetTagsForContact(client: GraphQLClient, id: string): Promise<ContactWithActions> {
    return new Promise((resolve, reject) => {
        const query = gql`query GetActionsForContact($id: ID!) {
            contact(id: $id) {
                tags {
                    id
                    name
                }
            }
        }`

        client.request(query, {id}).then((response: any) => {
            if (response.contact.tags) {
                resolve(response.contact.tags);
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

        const query = gql`mutation UpdateContact($contact: ContactUpdateInput!) {
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
                        notes: data.notes,
                        definitionId: data.definitionId,
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
export function GetContactNotes(client: GraphQLClient, contactId: string): Promise<PaginatedResponse<Note>> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactNotes($contactId: ID!, $pagination: Pagination!) {
            contact(id: $contactId) {
                id
                notes(pagination: $pagination) {
                    content {
                        id
                        html
                        createdAt
                        createdBy {
                            id
                            firstName
                            lastName
                        }
                        source
                    }
                }
            }
        }`

        client.request(query, {
            contactId,
            pagination: {
                limit: 999,
                page: 0
            }
        }).then((response: any) => {
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

        const query = gql`mutation AddNote($contactId: ID!, $input: NoteInput!) {
            note_CreateForContact(contactId: $contactId, input: $input) {
                id
                html
            }
        }`

        client.request(query, {
                contactId,
                input: {
                    html: data.html
                }
            }
        ).then((response: any) => {
            if (response.note_CreateForContact) {
                resolve(response.note_CreateForContact);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function AddTagForContact(client: GraphQLClient, input: any): Promise<Note> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation AddTagForContact($input: ContactTagInput!) {
            contact_AddTagById(input: $input) {
                id
            }
        }`

        client.request(query, { input })
            .then((response: any) => {
            if (response.contact_AddTagById) {
                resolve(response.contact_AddTagById);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}

export function RemoveTagFromContact(client: GraphQLClient, input: {contactId:string, tagId:string}): Promise<Note> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation RemoveTagFromContact($input: ContactTagInput!) {
            contact_RemoveTagById(input: $input) {
                id
            }
        }`

        client.request(query, { input })
            .then((response: any) => {
                if (response.contact_RemoveTagById) {
                    resolve(response.contact_RemoveTagById);
                } else {
                    reject(response.errors);
                }
            }).catch(reason => {
            reject(reason);
        });
    });
}
