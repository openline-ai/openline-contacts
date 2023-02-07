import type {NextPage} from 'next'

import {DashboardList as ContactListComponent} from "../../components/contact/index";

const ContactList: NextPage = () => {

    return (
        <ContactListComponent fullScreenMode />
    );
}

export default ContactList
