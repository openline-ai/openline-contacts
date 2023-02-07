import {gql, GraphQLClient} from "graphql-request";
import {Contact, ContactTag, Note} from "../models/contact";
import {PaginatedResponse} from "../utils/pagination";


export function GetTags(client: GraphQLClient): Promise<ContactTag[]> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetTags {
            tags {
                id
                name
            }
        }`

        client.request(query).then((response: any) => {
            if (response.tags) {
                resolve(response.tags);
            } else {
                reject(response.error);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}

export function CreateTag(client: GraphQLClient, input: {name: string}): Promise<ContactTag> {
    return new Promise((resolve, reject) => {
        const mutation = gql`mutation CreateTag($input: TagInput!) {
            tag_Create(input: $input)  {
                id
                name
                createdAt
                updatedAt
                source
            }
        }`

        client.request(mutation, {input}).then((response: any) => {
            if (response.tag_Create) {
                resolve(response.tag_Create);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}

export function UpdateTag(client: GraphQLClient): Promise<ContactTag[]> {
    return new Promise((resolve, reject) => {
        const mutation = gql`mutation UpdateTag($input: TagUpdateInput!) {
            tag_Update(input: $input)  {
                id
                name
            }
        }`



        client.request(mutation).then((response: any) => {
            if (response.tag_Update) {
                resolve(response.tag_Update);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}
export function DeleteTag(client: GraphQLClient, id: string): Promise<ContactTag[]> {
    return new Promise((resolve, reject) => {
        const mutation = gql`mutation DeleteTag($id: ID!) {
            tag_Delete(id: $id)  {
                result
            }
        }`

        client.request(mutation, {id}).then((response: any) => {
            if (response.tag_Delete) {
                resolve(response.tag_Delete);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}

