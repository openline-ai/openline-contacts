import {Address} from "./Address";

export type Organization = {
    id: string | undefined;
    name: string;
    description: string;
    industry: string;
    domain: string;
    website: string;
    contactRoles: any
    addresses: Array<Address>
    source: string
}