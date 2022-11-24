import {gql, GraphQLClient} from "graphql-request";
import {Contact, ContactType} from "../models/contact";

export function GetContactTypes(client: GraphQLClient): Promise<ContactType[]> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetContactTypeList {
            contactTypes {
                id
                name
            }
        }`

        //getting and building the entity definitions
        //the custom fields and sets are ordered by the order property
        client.request(query).then((response: any) => {
            if (response.contactTypes) {
                resolve(response.contactTypes);
            } else {
                resolve([]);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}