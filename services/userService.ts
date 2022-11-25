import {gql, GraphQLClient} from "graphql-request";
import {Page, PageOf, Pagination} from "../models/pagination";
import {User} from "../models/user";

export function GetUsersPage(client: GraphQLClient, pagination: Pagination, where: any): Promise<Page<User>> {
    return new Promise((resolve, reject) => {

        const query = gql`query SearchOwner ($pagination: Pagination!, $where: Filter) {
            users(pagination: $pagination, where: $where){
                content{
                    id
                    firstName
                    lastName
                    email
                }
                totalPages
                totalElements
            }
        }`

        //getting and building the entity definitions
        //the custom fields and sets are ordered by the order property
        client.request(query, {
            pagination: pagination,
            where: where
        }).then((response: any) => {
            if (response.users) {
                resolve(PageOf(response.users.content, response.totalElements));
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });

}