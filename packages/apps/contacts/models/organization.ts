import {Address} from "./Address";
import {Contact} from "./contact";

export type Organization = {
    id: string | undefined;
    name: string;
    description: string;
    industry: string;
    domain: string;
    website: string;
    contactRoles: any
    contacts: {
        content: Array<Contact>
    }
    addresses: Array<Address>
    source: string
}