import {gql, GraphQLClient} from "graphql-request";
import {ContactGroup} from "../models/contactGroup";

export function GetContactGroup(client: GraphQLClient, id: string): Promise<ContactGroup> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactGroup($id: ID!) {
            contactGroup(id: $id) {
                id
                name
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            response.contactGroup ? resolve(response.contactGroup) : reject(response.errors);
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function CreateContactGroup(client: GraphQLClient, data: any): Promise<ContactGroup> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation CreateContactGroup($contactGroup: ContactGroupInput!) {
            contactGroupCreate(input: $contactGroup) {
                id
            }
        }`

        client.request(query, {
                contactGroup: {
                    name: data.name
                }
            }
        ).then((response: any) => {
            if (response.contactGroupCreate) {
                resolve(response.contactGroupCreate);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function UpdateContactGroup(client: GraphQLClient, data: any): Promise<ContactGroup> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation UpdateContactGroup($contactGroup: ContactGroupUpdateInput!) {
            contactGroupUpdate(input: $contactGroup) {
                id
            }
        }`

        client.request(query, {
                contactGroup: {
                    id: data.id,
                    name: data.name
                }
            }
        ).then((response: any) => {
            if (response.contactGroupUpdate) {
                resolve(response.contactGroupUpdate);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function DeleteContactGroup(client: GraphQLClient, id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation DeleteContactGroup($id: ID!) {
            contactGroupDeleteAndUnlinkAllContacts(id: $id) {
                result
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.contactGroupDeleteAndUnlinkAllContacts) {
                resolve(response.contactGroupDeleteAndUnlinkAllContacts.result);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function AddContactToContactGroup(client: GraphQLClient, contactId: any, groupId: string): Promise<void> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation AddContactToGroup($groupId: ID!, $contactId:ID!) {
            contactGroupAddContact(groupId: $groupId, contactId: $contactId) {
                result
            }
        }`

        client.request(query, {
            groupId: groupId,
            contactId: contactId
        }).then((response: any) => {
            if (response.contactGroupAddContact?.result) {
                resolve();
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function RemoveContactFromGroup(client: GraphQLClient, contactId: any, groupId: string): Promise<void> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation RemoveContactFromGroup($groupId: ID!, $contactId:ID!) {
            contactGroupRemoveContact(groupId: $groupId, contactId: $contactId) {
                result
            }
        }`

        client.request(query, {
            groupId: groupId,
            contactId: contactId
        }).then((response: any) => {
            if (response.contactGroupRemoveContact?.result) {
                resolve();
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}