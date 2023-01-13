import type {NextPage} from 'next'

import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {ContactList as ContactListComponent} from "../../components/contact/index";

const ContactList: NextPage = () => {


    return (
        <ContactListComponent fullScreenMode />
    );
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default ContactList
