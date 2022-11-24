import {gql, GraphQLClient} from "graphql-request";
import {Contact} from "../models/contact";

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

        //getting and building the entity definitions
        //the custom fields and sets are ordered by the order property
        client.request(query, {id: id}).then((response: any) => {
            if (response.contact) {
                resolve(response.contact);
            } else {
                resolve([]);
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

        //getting and building the entity definitions
        //the custom fields and sets are ordered by the order property
        client.request(query, {
                contact: {
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
            if (response.contact_Create) {
                resolve(response.contact_Create);
            } else {
                reject(response.error);
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

        //getting and building the entity definitions
        //the custom fields and sets are ordered by the order property
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
                reject(response.error);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}