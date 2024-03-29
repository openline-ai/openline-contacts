import {gql, GraphQLClient} from "graphql-request";
import {EntityDefinition} from "../models/customFields";

export function GetEntityDefinitions(client: GraphQLClient, type: String): Promise<EntityDefinition[]> {
    return new Promise((resolve, reject) => {

        const entityDefinitionsQuery = gql`query GetEntityExtensions {
            entityTemplates(extends: ${type}) {
                id
                name
                fieldSets {
                    id
                    name
                    order
                    customFields {
                        id
                        name
                        type
                        order
                        mandatory
                        length
                        min
                        max
                    }
                }
                customFields {
                    id
                    name
                    type
                    order
                    mandatory
                    length
                    min
                    max
                }
            }
        }`

        //getting and building the entity definitions
        //the custom fields and sets are ordered by the order property
        client.request(entityDefinitionsQuery).then((response: any) => {
            if (response.entityTemplates) {
                const definitions: EntityDefinition[] = [];

                response.entityTemplates.forEach((ed: any) => {

                    var sortedData = [] as any;
                    ed.customFields.forEach((f: any) => sortedData.push(f));
                    ed.fieldSets.forEach((f: any) => {
                        f.customFields = f.customFields.sort(function (a: any, b: any) {
                            return a.order - b.order;
                        });
                        sortedData.push(f);
                    });

                    sortedData = sortedData.sort(function (a: any, b: any) {
                        return a.order - b.order;
                    });

                    definitions.push({
                        id: ed.id,
                        name: ed.name,
                        fields: sortedData
                    })

                });

                resolve(definitions);
            } else {
                reject(response.errors);
            }
        }).catch(reason => {
            reject(reason);
        });
    });


}