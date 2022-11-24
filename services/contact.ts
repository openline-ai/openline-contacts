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