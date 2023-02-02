import {gql, GraphQLClient} from "graphql-request";
import {PaginatedRequest, PaginatedResponse, Pagination} from "../utils/pagination";
import {MapGridFilters} from "../utils/converters";
import {Organization} from "../models/organization";
import {Note} from "../models/contact";

export function UpdateNote(client: GraphQLClient, data: any): Promise<Note> {
    return new Promise((resolve, reject) => {
        const query = gql`mutation UpdateNote($input: NoteUpdateInput!) {
            note_Update(input: $input) {
                id
                html
            }
        }`
        client.request(query, {
            input: {
                id: data.id,
                html: data.html
            }
            }
        ).then((response: any) => {
            if (response.note_Update) {
                resolve(response.note_Update);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function DeleteNote(client: GraphQLClient, noteId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation DeleteContact($id: ID!) {
            note_Delete(id: $id) {
                result
            }
        }`

        client.request(query, {
            id: noteId
        }).then((response: any) => {
            if (response.note_Delete) {
                resolve(response.note_Delete.result);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}
