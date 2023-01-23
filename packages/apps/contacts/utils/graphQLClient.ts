import {GraphQLClient} from "graphql-request";

var client: GraphQLClient;

export function setClient(userName: string): void {
    client =  new GraphQLClient(`/customer-os-api/query`, {
        headers: {
            'X-Openline-USERNAME': userName
        }
    });
}

export function useGraphQLClient(): GraphQLClient {
    return client;
}