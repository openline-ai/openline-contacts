import {gql, GraphQLClient} from "graphql-request";
import {PaginatedRequest, PaginatedResponse} from "../utils/pagination";
import {MapGridFilters} from "../utils/converters";
import {Organization} from "../models/organization";

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
                    addresses {
                        id
                        createdAt
                        country
                        state
                        city
                        address
                        address2
                        zip
                        phone
                        fax
                        source
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

        const query = gql`query GetOrganization($id: ID!) {
            organization(id: $id) {
                id
                name
                description
                industry
                domain
                website
                contactRoles {
                    id
                    jobTitle
                    primary
                    contact {
                        id
                        title
                        firstName
                        lastName
                        source
                        title
                        addresses {
                            id
                            createdAt
                            country
                            state
                            city
                            address
                            address2
                            zip
                            phone
                            fax
                            source
                            
                        }
                        contactType {
                            id
                        }
                        phoneNumbers {
                            id
                            e164
                            label
                            primary
                            source
                        }
                        emails {
                            id
                            email
                            primary
                            source
                        }
                    }
                }
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            response.organization ? resolve(response.organization) : reject(response.errors);
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

export function UpdateOrganization(client: GraphQLClient, data: any): Promise<Organization> {
    return new Promise((resolve, reject) => {

        const query = gql`mutation UpdateOrganization($id: ID!, $organization: OrganizationInput!) {
            organization_Update(id: $id, input: $organization) {
                id
            }
        }`

        client.request(query, {
                id: data.id,
                organization: {
                    name: data.name,
                    description: data.description,
                    industry: data.industry,
                    domain: data.domain,
                    website: data.website
                }
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
