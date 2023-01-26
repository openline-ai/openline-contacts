import {GraphQLClient} from "graphql-request";

var client: GraphQLClient;

export function initGraphQLClient(): void {
    client =  new GraphQLClient(`/customer-os-api/query`);
}

export function useGraphQLClient(): GraphQLClient {
    return client;
}