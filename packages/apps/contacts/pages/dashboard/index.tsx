import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {gql, GraphQLClient} from "graphql-request";
import {MapGridFilters} from "../../utils/converters";
import {PaginatedRequest} from "../../utils/pagination";
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import ContactList from "../../components/contact";
import OrganizationList from "../../components/organization/OrganizationList";
import ContactGroupList from "../../components/contact-group/ContactGroupList";
import {Divider} from "../../components/atoms";

const Dashboard: NextPage = () => {
    const client = new GraphQLClient(`/customer-os-api/query`);
    const router = useRouter();

    return (
        <div style={{padding: '40px'}}>

            <OrganizationList/>
            <Divider />
            <ContactList />

        </div>
    )
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default Dashboard
