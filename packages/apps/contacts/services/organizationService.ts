import {gql, GraphQLClient} from "graphql-request";
import {PaginatedRequest, PaginatedResponse} from "../utils/pagination";
import {MapGridFilters} from "../utils/converters";
import {Organization} from "../models/organization";
import {Note} from "../models/contact";

export function GetOrganizations(client: GraphQLClient, params: PaginatedRequest): Promise<PaginatedResponse<Organization>> {
    return new Promise((resolve, reject) => {
        const query = gql`query GetOrganizations($pagination: Pagination, $where: Filter, $sort: [SortBy!]){
            organizations(pagination: $pagination, where: $where, sort: $sort){
                content {
                    id
                    name
                    industry
                    website
                    organizationType {
                        id
                        name
                    }
                    source
                    locations {
                        id
                        name
                        place {
                            country
                            state
                            city
                        }
                    }
                }
                totalElements
            }
        }`

        client.request(query, {
            pagination: params.pagination,
            where: MapGridFilters(params.where),
            sort: params.sort,
        }).then((response: any) => {
            response.organizations ? resolve(response.organizations) : reject(response.errors);
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function GetOrganization(client: GraphQLClient, id: string): Promise<Organization> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetOrganization($id: ID!, $pagination: Pagination) {
            organization(id: $id) {
                id
                name
                description
                industry
                domain
                website
                contacts(pagination: $pagination) {
                    content {
                        id
                        firstName
                        lastName
                        tags {
                            name
                            id
                        }
                      
                        phoneNumbers {
                            id
                            label
                            primary
                            e164
                        }
                        emails {
                            id
                            label
                            primary
                            email
                        }
                        
                    }
                }
            }
        }`



        client.request(query, {id, pagination: {
            page: 0,
            limit: 999
            }}).then((response: any) => {
            response.organization ? resolve(response.organization) : reject(response.errors);
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function GetNotesForContactsInOrganisation(client: GraphQLClient, id: string): Promise<Organization> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetOrganization($id: ID!, $pagination: Pagination!) {
            organization(id: $id) {
                contacts(pagination: $pagination) {
                    content {
                        id
                        firstName
                        lastName
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
                }
            }
        }`



        client.request(query, {id: id, pagination: {limit: 999, page:0}}).then((response: any) => {
            response.organization ? resolve(response.organization) : reject(response.errors);
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function GetOrganizationNotes(client: GraphQLClient, id: string): Promise<Array<Note>> {
    return new Promise((resolve, reject) => {

        const query = gql`query GetOrganizationNotes($id: ID!,$pagination: Pagination) {
            organization(id: $id) {
                id
                notes(pagination: $pagination) {
                    content {
                        id
                        html
                        createdAt
                        updatedAt
                        createdBy {
                            id
                            firstName
                            lastName
                        }
                        source
                        sourceOfTruth
                        appSource
                    }
                }
            }
        }`

        client.request(query, {id: id, pagination: {
                limit: 999,
                page: 0
            }}).then((response: any) => {
            response.organization ? resolve(response.organization.notes.content) : reject(response.errors);
        }).catch(reason => {
            reject(reason);
        });
    });
}



export function CreateOrganization(client: GraphQLClient, data: any): Promise<Organization> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation CreateOrganization($organization: OrganizationInput!) {
            organization_Create(input: $organization) {
                id
            }
        }`

        client.request(query, {
                organization: {
                    name: data.name,
                    description: data.description,
                    industry: data.industry,
                    domain: data.domain,
                    website: data.website
                }
            }
        ).then((response: any) => {
            if (response.organization_Create) {
                resolve(response.organization_Create);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function UpdateOrganization(client: GraphQLClient, input: any): Promise<Organization> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation UpdateOrganization($input: OrganizationUpdateInput!) {
            organization_Update(input: $input) {
                id
            }
        }`

        client.request(query, {
               input
            }
        ).then((response: any) => {
            if (response.organization_Update) {
                resolve(response.organization_Update);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function DeleteOrganization(client: GraphQLClient, id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation DeleteContactGroup($id: ID!) {
            organization_Delete(id: $id) {
                result
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.organization_Delete) {
                resolve(response.organization_Delete.result);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}

export function CreateOrganizationNote(client: GraphQLClient, organizationId: string, data: any): Promise<Note> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation AddNoteToOrganization($organizationId: ID!, $note: NoteInput!) {
            note_CreateForOrganization(organizationId: $organizationId, input: $note) {
                id
                html
                appSource
            }
        }`

        client.request(query, {
                organizationId,
                note: {
                    html: data.html,
                    appSource: data?.appSource
                }
            }
        ).then((response: any) => {
            if (response.note_CreateForOrganization) {
                resolve(response.note_CreateForOrganization);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}