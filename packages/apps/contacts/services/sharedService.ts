import {gql, GraphQLClient} from "graphql-request";
import {PaginatedRequest} from "../utils/pagination";
import {Contact, Note} from "../models/contact";

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

export function GetDashboardData(client: GraphQLClient, request: PaginatedRequest): Promise<Contact> {
    return new Promise((resolve, reject) => {

        let searchTermFilter = request.where.filter((f: any) => f.property === 'searchTerm');

        const query = gql`
            query GetDashboardData($pagination: Pagination!${searchTermFilter.length > 0 ? ', $searchTerm: String' : ''}) {
            dashboardView(pagination: $pagination ${searchTermFilter.length > 0 ? ', searchTerm: $searchTerm' : ''}) {
                content {
                    
                    contact {
                        id
                        firstName
                        lastName
                        jobRoles {
                            jobTitle
                            primary
                        }
                        emails {
                            id
                            primary
                            email
                        }
                        locations {
                            id
                            name
                            place {
                                country
                                state
                                city
                                address
                                address2
                            }
                        }
                    }
                    organization {
                        id
                        name
                        industry
                    }
                }
                totalElements
            }
        }`

        let requestData = {pagination: request.pagination} as any;
        if (request.where && searchTermFilter.length > 0) {
            requestData['searchTerm'] = searchTermFilter[0].value
        }

        client.request(query, requestData).then((response: any) => {
            if (response.dashboardView) {
                resolve(response.dashboardView);
            } else {
                reject(response.error);
            }
        }).catch(reason => {
            reject(reason);
        });
    });
}
