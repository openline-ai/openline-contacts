import {Identity} from "@ory/client";

export function getUserName(identity: Identity): string {
    console.log(identity)
    return identity.traits.email || identity.traits.username
}