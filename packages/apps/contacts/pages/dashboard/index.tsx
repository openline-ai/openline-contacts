import type {NextPage} from 'next'
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {ContactList} from "../../components/contact/ContactList";
import {OrganizationList} from "../../components/organization/OrganizationList";
import {Divider} from "../../components/atoms";

const Dashboard: NextPage = () => {
    return (
        <div style={{padding: '40px'}}>

            <OrganizationList fullScreenMode={false}/>
            <Divider />
            <ContactList fullScreenMode={false} />

        </div>
    )
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default Dashboard
