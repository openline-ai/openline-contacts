import type {NextPage} from 'next'
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {OrganizationList as OrganizationListComponent} from '../../components/organization/OrganizationList'
const OrganizationList: NextPage = () => {
    return (
        <OrganizationListComponent fullScreenMode />
    );
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default OrganizationList
