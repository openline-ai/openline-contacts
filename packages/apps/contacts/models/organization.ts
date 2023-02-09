import {Location} from "./location";
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
    locations: Array<Location>
    source: string
}